import React from 'react';
import { Image, Linking } from 'react-native';
import Renderer, { act } from 'react-test-renderer';
import { Button } from '../design-system/components';
import { AppErrorBoundary } from '../shared/errors/AppErrorBoundary';
import { useAsyncAction } from '../shared/hooks/useAsyncAction';
import { ContactUsScreen } from '../features/contact/screens/ContactUsScreen';
import { companyContent } from '../mocks/fixtures/company';
import { BrandImage } from '../design-system/components/BrandImage';
import { createDemoTestStorage, fastTestHasher } from './demoTestStorage';
import {
  LocalDemoRepository,
  DEMO_DATABASE_KEY,
} from '../features/account/data/LocalDemoRepository';
import { createTestStore, createMemoryPreferences } from './createTestStore';
import { saveOnboardingCompleted } from '../features/onboarding/state/onboardingSlice';
import { setDemoAccess } from '../features/auth/state/authSlice';
import { OTPVerificationScreen } from '../features/auth/screens/AuthScreens';
import { AuthRepositoryProvider } from '../features/auth/data/AuthRepositoryProvider';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}
afterEach(() => jest.restoreAllMocks());

it('coalesces immediate repeated button presses and releases the lock', async () => {
  const onPress = jest.fn();
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(<Button label="Open" onPress={onPress} />);
  });
  const press = renderer.root
    .findAllByProps({ accessibilityLabel: 'Open' })
    .find(node => typeof node.props.onPress === 'function')!.props.onPress;
  await act(() => {
    press();
    press();
    press();
  });
  expect(onPress).toHaveBeenCalledTimes(1);
  await act(() => {
    jest.advanceTimersByTime(350);
    press();
  });
  expect(onPress).toHaveBeenCalledTimes(2);
  await act(() => renderer.unmount());
  expect(jest.getTimerCount()).toBe(0);
});
it('keeps async work single-flight and suppresses post-unmount UI continuations', async () => {
  let action!: ReturnType<typeof useAsyncAction>;
  let renderer!: Renderer.ReactTestRenderer;
  function Harness() {
    action = useAsyncAction();
    return null;
  }
  await act(() => {
    renderer = Renderer.create(<Harness />);
  });
  const wait = deferred<void>();
  const navigate = jest.fn();
  const work = jest.fn(async (active: () => boolean) => {
    await wait.promise;
    if (active()) navigate();
  });
  let first!: Promise<void>;
  let second!: Promise<void>;
  await act(() => {
    first = action.run(work);
    second = action.run(work);
  });
  expect(work).toHaveBeenCalledTimes(1);
  await act(() => renderer.unmount());
  await act(async () => {
    wait.resolve();
    await Promise.all([first, second]);
  });
  expect(navigate).not.toHaveBeenCalled();
  await action.run(work);
  expect(work).toHaveBeenCalledTimes(1);
});
it('recovers from a render failure without deleting persisted data or exposing the error text', async () => {
  const consoleError = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);
  let broken = true;
  function Child() {
    if (broken) throw new Error('private profile detail');
    return <Button label="Recovered" />;
  }
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(
      <AppErrorBoundary>
        <Child />
      </AppErrorBoundary>,
    );
  });
  expect(JSON.stringify(renderer.toJSON())).not.toContain(
    'private profile detail',
  );
  expect(renderer.root.findByType(Button).props.label).toBe('Restart app view');
  broken = false;
  await act(() => renderer.root.findByType(Button).props.onPress());
  expect(renderer.root.findByType(Button).props.label).toBe('Recovered');
  await act(() => renderer.unmount());
  consoleError.mockRestore();
});
it('does not open duplicate external apps while a contact action is pending', async () => {
  const pending = deferred<void>();
  const open = jest.spyOn(Linking, 'openURL').mockReturnValue(pending.promise);
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(
      <ContactUsScreen navigation={{ navigate: jest.fn() } as never} />,
    );
  });
  const press = renderer.root
    .findAllByProps({ accessibilityLabel: 'Open Maps' })
    .find(node => typeof node.props.onPress === 'function')!.props.onPress;
  let first!: Promise<void>;
  await act(() => {
    first = press();
    press();
  });
  expect(open).toHaveBeenCalledTimes(1);
  expect(open).toHaveBeenCalledWith(companyContent.contact.mapsUrl);
  await act(() => renderer.unmount());
  await act(async () => {
    pending.resolve();
    await first;
  });
});
it('shows a meaningful fallback for absent image sources', async () => {
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(
      <BrandImage
        source={undefined}
        accessibilityLabel="Client logo unavailable"
      />,
    );
  });
  expect(renderer.root.findAllByType(Image)).toHaveLength(0);
  expect(JSON.stringify(renderer.toJSON())).toContain(
    'Client logo unavailable',
  );
  await act(() => renderer.unmount());
});
it('removes orphaned quote documents when clearing a corrupted, unhydrated database', async () => {
  const { storage, values } = createDemoTestStorage();
  values.set(DEMO_DATABASE_KEY, '{broken');
  values.set('champion-quotes:v1:account:old:orphan', 'private');
  values.set('unrelated-setting', 'keep');
  const repo = new LocalDemoRepository(storage, fastTestHasher);
  await repo.clearDemoData();
  expect(
    [...values.keys()].filter(key => key.startsWith('champion-quotes:')),
  ).toEqual([]);
  expect(values.get('unrelated-setting')).toBe('keep');
  expect(
    await new LocalDemoRepository(storage, fastTestHasher).hydrate(),
  ).toBeNull();
});
it('reports failed data cleanup and lets the next attempt remove retained files', async () => {
  const { repo, storage, values } = createDemoTestStorage();
  values.set('champion-quotes:v1:account:old:orphan', 'private');
  jest
    .mocked(storage.removeItem)
    .mockRejectedValueOnce(new Error('disk unavailable'));
  await expect(repo.clearDemoData()).rejects.toThrow(/some local files/);
  expect(repo.getSnapshot().profile).toBeNull();
  await repo.clearDemoData();
  expect(
    [...values.keys()].some(key => key.startsWith('champion-quotes:')),
  ).toBe(false);
});
it('coalesces overlapping onboarding writes and session changes', async () => {
  const preferences = createMemoryPreferences();
  const wait = deferred<void>();
  const write = jest
    .spyOn(preferences, 'setOnboardingCompleted')
    .mockReturnValue(wait.promise);
  const store = createTestStore({ preferences });
  const first = store.dispatch(saveOnboardingCompleted(true));
  const second = store.dispatch(saveOnboardingCompleted(true));
  expect(write).toHaveBeenCalledTimes(1);
  wait.resolve();
  await Promise.all([first, second]);
  expect(store.getState().onboarding.completed).toBe(true);
  const sessionWait = deferred<void>();
  const setAccess = jest
    .spyOn(store.demoRepository, 'setAccess')
    .mockReturnValue(sessionWait.promise);
  const accessOne = store.dispatch(setDemoAccess('guest'));
  const accessTwo = store.dispatch(setDemoAccess('guest'));
  expect(setAccess).toHaveBeenCalledTimes(1);
  sessionWait.resolve();
  await Promise.all([accessOne, accessTwo]);
  expect(store.getState().auth.access).toBe('guest');
});
it('offers a password-reset restart when verification route state is absent', async () => {
  const { repo } = createDemoTestStorage();
  const replace = jest.fn();
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(
      <AuthRepositoryProvider repository={repo}>
        <OTPVerificationScreen
          route={{ params: undefined } as never}
          navigation={{ goBack: jest.fn(), replace } as never}
        />
      </AuthRepositoryProvider>,
    );
  });
  expect(renderer.root.findByType(Button).props.label).toBe(
    'Restart password reset',
  );
  await act(() => renderer.root.findByType(Button).props.onPress());
  expect(replace).toHaveBeenCalledWith('ForgotPassword');
  await act(() => renderer.unmount());
});
