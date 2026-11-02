import {
  AuthRepositoryProvider,
  useDemoSelector,
} from '../features/auth/data/AuthRepositoryProvider';
import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { QuoteField } from '../features/quote/components/QuoteFields';
import { FormInput } from '../features/auth/components/AuthPrimitives';
import { createDemoTestStorage } from './demoTestStorage';
import { createGuestQuoteHandoff } from '../features/quote/state/guestQuoteHandoff';
import { emptyQuoteForm } from '../features/quote/domain/Quote';

jest.mock('../features/auth/components/AuthPrimitives', () => ({
  FormInput: jest.fn(() => null),
}));
it('renders only the field being edited rather than its unchanged sibling', async () => {
  const onChange = jest.fn();
  const fields = (title: string) => (
    <>
      <QuoteField
        field="title"
        label="Project title"
        value={title}
        editable
        multiline={false}
        onChange={onChange}
      />
      <QuoteField
        field="location"
        label="Location"
        value="Dubai"
        editable
        multiline={false}
        onChange={onChange}
      />
    </>
  );
  jest.mocked(FormInput).mockClear();
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(fields('Shop'));
  });
  expect(FormInput).toHaveBeenCalledTimes(2);
  await act(() => renderer.update(fields('Shopfront')));
  expect(FormInput).toHaveBeenCalledTimes(3);
  expect(jest.mocked(FormInput).mock.calls.at(-1)?.[0].value).toBe('Shopfront');
  await act(() => renderer.unmount());
});
it('an older handoff attempt cannot claim or delete a newer guest form', async () => {
  const { storage } = createDemoTestStorage();
  const handoff = createGuestQuoteHandoff(storage);
  await handoff.save({ form: emptyQuoteForm, step: 0 });
  const older = (await handoff.restore())!;
  await handoff.save({
    form: { ...emptyQuoteForm, title: 'New request' },
    step: 1,
  });
  await expect(handoff.claim('account-a', older.id)).rejects.toThrow(/changed/);
  await handoff.clear(older.id);
  expect(await handoff.restore()).toMatchObject({
    form: { title: 'New request' },
    step: 1,
  });
});
it('serializes handoff changes and avoids rewriting an existing account claim', async () => {
  const { storage } = createDemoTestStorage();
  const handoff = createGuestQuoteHandoff(storage);
  await handoff.save({ form: emptyQuoteForm, step: 0 });
  await handoff.claim('account-a');
  jest.mocked(storage.setItem).mockClear();
  await Promise.all([handoff.claim('account-a'), handoff.claim('account-a')]);
  expect(storage.setItem).not.toHaveBeenCalled();
  expect(await handoff.restore('account-b')).toBeNull();
});
it('preserves the account-bound handoff after cleanup failure so adoption can retry', async () => {
  const { storage } = createDemoTestStorage();
  const handoff = createGuestQuoteHandoff(storage);
  await handoff.save({ form: emptyQuoteForm, step: 0 });
  const draft = (await handoff.restore())!;
  await handoff.claim('account-a', draft.id);
  jest
    .mocked(storage.removeItem)
    .mockRejectedValueOnce(new Error('unavailable'));
  await expect(handoff.clear(draft.id)).rejects.toThrow('unavailable');
  expect(await handoff.restore('account-a')).toMatchObject({ id: draft.id });
  expect(await handoff.restore('account-b')).toBeNull();
  await handoff.clear(draft.id);
  expect(await handoff.restore('account-a')).toBeNull();
});

it('does not rerender a profile selector for unrelated quotation changes', async () => {
  const { repo } = createDemoTestStorage();
  await repo.signUp(
    'Demo Visitor',
    'demo@example.com',
    'Sample123!',
    '+971500000000',
  );
  const rendered = jest.fn();
  function ProfileSubscriber() {
    const profile = useDemoSelector(snapshot => snapshot.profile);
    rendered(profile?.name);
    return null;
  }
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(
      <AuthRepositoryProvider repository={repo}>
        <ProfileSubscriber />
      </AuthRepositoryProvider>,
    );
  });
  expect(rendered).toHaveBeenCalledTimes(1);
  await act(async () => {
    await repo.saveQuoteDraft(emptyQuoteForm, 'unrelated', 0);
  });
  expect(rendered).toHaveBeenCalledTimes(1);
  await act(async () => {
    await repo.updateProfile({
      ...repo.getSnapshot().profile!,
      name: 'Updated Visitor',
    });
  });
  expect(rendered).toHaveBeenCalledTimes(2);
  expect(rendered).toHaveBeenLastCalledWith('Updated Visitor');
  await act(() => renderer.unmount());
});
