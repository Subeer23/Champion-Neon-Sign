import React from 'react';
import { AppState, Text, type AppStateStatus } from 'react-native';
import Renderer, { act } from 'react-test-renderer';
import { usePortraitPrelude } from '../features/founder/hooks/usePortraitPrelude';

function Harness() {
  return <Text>{usePortraitPrelude() ? 'story' : 'portrait'}</Text>;
}
let renderer: Renderer.ReactTestRenderer;
let originalState: PropertyDescriptor | undefined;
beforeEach(() => {
  originalState = Object.getOwnPropertyDescriptor(AppState, 'currentState');
  Object.defineProperty(AppState, 'currentState', {
    value: 'active',
    configurable: true,
    writable: true,
  });
});
afterEach(async () => {
  await act(() => renderer.unmount());
  jest.restoreAllMocks();
  if (originalState)
    Object.defineProperty(AppState, 'currentState', originalState);
});
const visible = () => renderer.root.findByType(Text).props.children;
test('waits three seconds without restarting on rerender', async () => {
  await act(() => {
    renderer = Renderer.create(<Harness />);
  });
  await act(() => {
    jest.advanceTimersByTime(1000);
    renderer.update(<Harness />);
  });
  await act(() => {
    jest.advanceTimersByTime(1999);
  });
  expect(visible()).toBe('portrait');
  await act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(visible()).toBe('story');
});
test('counts foreground time and removes the lifecycle listener on completion', async () => {
  let change: (state: AppStateStatus) => void = () => {};
  const remove = jest.fn();
  jest
    .spyOn(AppState, 'addEventListener')
    .mockImplementation((_event, listener) => {
      change = listener;
      return { remove };
    });
  await act(() => {
    renderer = Renderer.create(<Harness />);
  });
  await act(() => {
    jest.advanceTimersByTime(1000);
    change('background');
  });
  await act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(visible()).toBe('portrait');
  await act(() => {
    change('active');
    jest.advanceTimersByTime(1999);
  });
  expect(visible()).toBe('portrait');
  await act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(visible()).toBe('story');
  expect(remove).toHaveBeenCalledTimes(1);
});
