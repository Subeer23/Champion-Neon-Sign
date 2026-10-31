/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import {
  createTestStore,
  createMemoryPreferences,
} from '../src/test/createTestStore';
import { HomeScreen } from '../src/features/home/screens/HomeScreen';
import { rootApi } from '../src/app/store/rootApi';

test('renders correctly', async () => {
  const store = createTestStore({ preferences: createMemoryPreferences(true) });
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App store={store} />);
  });
  expect(renderer!.root.findByType(HomeScreen)).toBeDefined();
  await ReactTestRenderer.act(() => {
    renderer!.unmount();
    store.dispatch(rootApi.util.resetApiState());
  });
});
