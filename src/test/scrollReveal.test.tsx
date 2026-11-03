import React from 'react';
import {
  AccessibilityInfo,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import Renderer, { act } from 'react-test-renderer';
import {
  RevealScrollView,
  ScrollReveal,
} from '../shared/components/ScrollReveal';
import { useReducedMotion } from '../shared/hooks/useReducedMotion';
jest.mock('../shared/hooks/useReducedMotion', () => ({
  useReducedMotion: jest.fn(() => false),
}));

beforeEach(() => {
  jest.mocked(useReducedMotion).mockReturnValue(false);
  jest
    .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
    .mockResolvedValue(false);
});
afterEach(() => jest.restoreAllMocks());
const layoutEvent = (y: number, height: number) => ({
  nativeEvent: { layout: { x: 0, y, width: 360, height } },
});
const scrollEvent = (y: number) => ({
  nativeEvent: {
    contentOffset: { x: 0, y },
    layoutMeasurement: { width: 360, height: 500 },
  },
});
function blockLayout(renderer: Renderer.ReactTestRenderer, y: number) {
  renderer.root
    .findByType(ScrollReveal)
    .findAll(node => typeof node.props.onLayout === 'function')[0]!
    .props.onLayout(layoutEvent(y, 160));
}
it('starts a native-driven reveal only upon entering the viewport, without rerendering content on scroll', async () => {
  const start = jest.fn();
  const stop = jest.fn();
  const timing = jest
    .spyOn(Animated, 'timing')
    .mockReturnValue({ start, stop } as never);
  const rendered = jest.fn();
  function Story() {
    rendered();
    return (
      <ScrollReveal>
        <Text>Story section</Text>
      </ScrollReveal>
    );
  }
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(
      <RevealScrollView>
        <Story />
      </RevealScrollView>,
    );
  });
  const scroll = renderer.root.findByType(ScrollView);
  await act(() => {
    scroll.props.onLayout(layoutEvent(0, 500));
    blockLayout(renderer, 1000);
  });
  expect(timing).not.toHaveBeenCalled();
  const before = rendered.mock.calls.length;
  await act(() => {
    scroll.props.onScroll(scrollEvent(600));
  });
  expect(timing).toHaveBeenCalledTimes(1);
  expect(timing).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ useNativeDriver: true, duration: 380 }),
  );
  await act(() => {
    scroll.props.onScroll(scrollEvent(750));
    scroll.props.onScroll(scrollEvent(0));
    scroll.props.onScroll(scrollEvent(600));
  });
  expect(timing).toHaveBeenCalledTimes(1);
  expect(rendered).toHaveBeenCalledTimes(before);
  await act(() => renderer.unmount());
  expect(stop).toHaveBeenCalled();
});
it.each(['reduced-motion', 'screen-reader'])(
  'keeps content visible without motion for %s',
  async preference => {
    if (preference === 'reduced-motion')
      jest.mocked(useReducedMotion).mockReturnValue(true);
    else
      jest
        .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
        .mockResolvedValue(true);
    const timing = jest.spyOn(Animated, 'timing');
    let renderer!: Renderer.ReactTestRenderer;
    await act(async () => {
      renderer = Renderer.create(
        <RevealScrollView>
          <ScrollReveal>
            <Text>Accessible story</Text>
          </ScrollReveal>
        </RevealScrollView>,
      );
    });
    const scroll = renderer.root.findByType(ScrollView);
    await act(() => {
      scroll.props.onLayout(layoutEvent(0, 500));
      blockLayout(renderer, 1000);
      scroll.props.onScroll(scrollEvent(600));
    });
    const animated = renderer.root
      .findByType(ScrollReveal)
      .findAll(node => typeof node.props.onLayout === 'function')[0]!;
    expect(StyleSheet.flatten(animated.props.style).opacity).toBe(1);
    expect(timing).not.toHaveBeenCalled();
    await act(() => renderer.unmount());
  },
);
it('cleans up its accessibility listener on unmount', async () => {
  const remove = jest.fn();
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({ remove });
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(
      <RevealScrollView>
        <ScrollReveal>
          <Text>Story</Text>
        </ScrollReveal>
      </RevealScrollView>,
    );
  });
  await act(() => renderer.unmount());
  expect(remove).toHaveBeenCalledTimes(1);
});
