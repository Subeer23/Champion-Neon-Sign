import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from '../shared/components/Screen';

describe('screen bottom safe area ownership', () => {
  it.each([undefined, 60, 94])('respects tab bar height %s', async height => {
    let renderer!: Renderer.ReactTestRenderer;
    await act(() => {
      renderer = Renderer.create(
        <BottomTabBarHeightContext.Provider value={height}>
          <Screen />
        </BottomTabBarHeightContext.Provider>,
      );
    });
    expect(renderer.root.findByType(SafeAreaView).props.edges).toEqual(
      height === undefined ? ['left', 'right', 'bottom'] : ['left', 'right'],
    );
    await act(() => renderer.unmount());
  });
});
