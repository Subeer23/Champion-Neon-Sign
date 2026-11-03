import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import App from '../../App';
import { Button } from '../design-system/components';
import { FounderCinematicScreen } from '../features/founder/screens/FounderCinematicScreen';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { createMemoryPreferences, createTestStore } from './createTestStore';
import { createDemoTestStorage } from './demoTestStorage';
import { rootApi } from '../app/store/rootApi';

it.each(['onboarding', 'welcome', 'guest', 'account'] as const)(
  'places the presentation before the existing %s destination and preserves stored state',
  async destination => {
    const preferences = createMemoryPreferences(destination !== 'onboarding');
    if (destination === 'welcome') await preferences.setDemoAccess?.(null);
    const { repo } = createDemoTestStorage();
    if (destination === 'account')
      await repo.signUp(
        'Demo Visitor',
        'demo@example.com',
        'Sample123!',
        '+971500000000',
      );
    const store = createTestStore({ preferences, demo: repo });
    let renderer!: Renderer.ReactTestRenderer;
    await act(async () => {
      renderer = Renderer.create(<App store={store} />);
    });
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(renderer.root.findAllByType(FounderCinematicScreen)).toHaveLength(1);
    expect(renderer.root.findAllByType(HomeScreen)).toHaveLength(0);
    const before = repo.getSnapshot().profile?.id;
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    await act(async () => {
      renderer.root
        .findAllByType(Button)
        .find(
          item => item.props.accessibilityLabel === 'Skip founder presentation',
        )!
        .props.onPress();
    });
    expect(renderer.root.findAllByType(FounderCinematicScreen)).toHaveLength(0);
    if (destination === 'onboarding')
      expect(renderer.root.findAllByType(OnboardingScreen)).toHaveLength(1);
    else if (destination === 'welcome')
      expect(JSON.stringify(renderer.toJSON())).toContain('Continue as guest');
    else expect(renderer.root.findAllByType(HomeScreen)).toHaveLength(1);
    expect(repo.getSnapshot().profile?.id).toBe(before);
    expect(await preferences.getOnboardingCompleted()).toBe(
      destination !== 'onboarding',
    );
    await act(async () => {
      renderer.update(<App store={store} />);
    });
    expect(renderer.root.findAllByType(FounderCinematicScreen)).toHaveLength(0);
    await act(() => renderer.unmount());
    // A fresh root mount represents a new JS/app launch; completion is intentionally not stored.
    await act(async () => {
      renderer = Renderer.create(<App store={store} />);
    });
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(renderer.root.findAllByType(FounderCinematicScreen)).toHaveLength(1);
    await act(() => {
      renderer.unmount();
      store.dispatch(rootApi.util.resetApiState());
    });
  },
);
it('uses the same normal destination when playback completes automatically', async () => {
  const store = createTestStore({ preferences: createMemoryPreferences(true) });
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(<App store={store} />);
  });
  await act(async () => {
    jest.advanceTimersByTime(3000);
  });
  await act(async () => {
    renderer.root.findByType(FounderCinematicScreen).props.onComplete();
  });
  expect(renderer.root.findAllByType(HomeScreen)).toHaveLength(1);
  expect(
    renderer.root
      .findAllByType(Button)
      .some(item => item.props.label === 'Explore Founder Journey'),
  ).toBe(false);
  await act(() => {
    renderer.unmount();
    store.dispatch(rootApi.util.resetApiState());
  });
});
