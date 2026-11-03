import React from 'react';
import {
  AccessibilityInfo,
  AppState,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Renderer, { act } from 'react-test-renderer';
import { FounderCinematicScreen } from '../features/founder/screens/FounderCinematicScreen';
import { Button } from '../design-system/components';
import { FounderPlayback } from '../features/founder/domain/FounderPlayback';
import { founderContent } from '../features/founder/data/founderContent';
let renderer: Renderer.ReactTestRenderer;
let originalState: PropertyDescriptor | undefined;
beforeEach(() => {
  originalState = Object.getOwnPropertyDescriptor(AppState, 'currentState');
  Object.defineProperty(AppState, 'currentState', {
    value: 'active',
    configurable: true,
    writable: true,
  });
  jest
    .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
    .mockResolvedValue(false);
  jest
    .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
    .mockResolvedValue(false);
});
afterEach(async () => {
  if (renderer) await act(() => renderer.unmount());
  jest.restoreAllMocks();
  if (originalState)
    Object.defineProperty(AppState, 'currentState', originalState);
});
async function mount(done = jest.fn(), finishPrelude = true) {
  await act(async () => {
    renderer = Renderer.create(<FounderCinematicScreen onComplete={done} />);
  });
  if (finishPrelude)
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
  return done;
}
async function press(label: string) {
  await act(async () => {
    renderer.root
      .findAllByType(Button)
      .find(
        item =>
          item.props.label === label || item.props.accessibilityLabel === label,
      )!
      .props.onPress();
  });
}
function measure() {
  const scroll = renderer.root.findByType(ScrollView);
  scroll.props.onLayout({ nativeEvent: { layout: { height: 600 } } });
  const blocks = renderer.root.findAll(
    node =>
      String(node.props.testID ?? '').startsWith('founder-cinematic-') &&
      typeof node.props.onLayout === 'function',
  );
  const unique = new Set<unknown>();
  let index = 0;
  for (const node of blocks) {
    const callback = node.props.onLayout;
    if (unique.has(callback)) continue;
    unique.add(callback);
    callback({ nativeEvent: { layout: { y: index++ * 220, height: 200 } } });
  }
  expect(unique.size).toBe(
    2 + founderContent.sections.length + founderContent.timeline.length,
  );
  scroll.props.onContentSizeChange(360, 17 * 220);
}
it('skips immediately and coalesces repeated exits', async () => {
  const done = await mount();
  await press('Skip founder presentation');
  await press('Skip founder presentation');
  expect(done).toHaveBeenCalledTimes(1);
});
it('renders all existing verified story sections and milestones', async () => {
  await mount();
  const text = JSON.stringify(renderer.toJSON());
  for (const section of founderContent.sections)
    expect(text).toContain(section.text);
  for (const item of founderContent.timeline)
    expect(text).toContain(item.title);
});
it('autostarts from measured layout, pauses on touch, resumes and replays', async () => {
  const resume = jest.spyOn(FounderPlayback.prototype, 'resume');
  const replay = jest.spyOn(FounderPlayback.prototype, 'replay');
  await mount();
  await act(async () => measure());
  expect(resume).toHaveBeenCalled();
  await act(() => renderer.root.findByType(ScrollView).props.onTouchStart());
  expect(
    renderer.root
      .findAllByType(Button)
      .some(item => item.props.label === 'Resume'),
  ).toBe(true);
  await press('Resume');
  await press('Replay');
  expect(replay).toHaveBeenCalledTimes(1);
});
it('offers a static manual alternative for reduced motion', async () => {
  jest
    .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
    .mockResolvedValue(true);
  const resume = jest.spyOn(FounderPlayback.prototype, 'resume');
  const done = await mount();
  await act(async () => measure());
  expect(resume).not.toHaveBeenCalled();
  expect(JSON.stringify(renderer.toJSON())).toContain('Manual reading mode');
  await press('Continue to app');
  expect(done).toHaveBeenCalledTimes(1);
});
it('pauses for backgrounding, does not restart on foreground and removes lifecycle listeners', async () => {
  let change: ((state: string) => void) | undefined;
  const remove = jest.fn();
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_, callback) => {
    change = callback as (state: string) => void;
    return { remove };
  });
  const resume = jest.spyOn(FounderPlayback.prototype, 'resume');
  await mount();
  await act(async () => measure());
  await act(() => change?.('background'));
  const count = resume.mock.calls.length;
  await act(() => change?.('active'));
  expect(resume).toHaveBeenCalledTimes(count);
  expect(
    renderer.root
      .findAllByType(Button)
      .some(item => item.props.label === 'Resume'),
  ).toBe(true);
  await act(() => renderer.unmount());
  expect(remove).toHaveBeenCalled();
});
it('keeps screen-reader users in manual reading mode', async () => {
  jest
    .spyOn(AccessibilityInfo, 'isScreenReaderEnabled')
    .mockResolvedValue(true);
  const resume = jest.spyOn(FounderPlayback.prototype, 'resume');
  await mount();
  await act(async () => measure());
  expect(resume).not.toHaveBeenCalled();
  expect(JSON.stringify(renderer.toJSON())).toContain('Manual reading mode');
});
it('cancels its scheduled frame on unmount and stops calling the playback clock', async () => {
  const requested = jest.spyOn(global, 'requestAnimationFrame');
  const cancel = jest.spyOn(global, 'cancelAnimationFrame');
  const tick = jest.spyOn(FounderPlayback.prototype, 'tick');
  await mount();
  await act(async () => measure());
  const ownedFrame = requested.mock.results.at(-1)!.value;
  await act(() => renderer.unmount());
  expect(cancel).toHaveBeenCalledWith(ownedFrame);
  const before = tick.mock.calls.length;
  await act(async () => {
    jest.advanceTimersByTime(1000);
  });
  expect(tick).toHaveBeenCalledTimes(before);
});
it('offers skip and manual reading after a playback failure', async () => {
  jest.spyOn(FounderPlayback.prototype, 'tick').mockImplementationOnce(() => {
    throw new Error('Frame failed');
  });
  const done = await mount();
  await act(async () => measure());
  await act(async () => {
    jest.advanceTimersByTime(100);
  });
  expect(JSON.stringify(renderer.toJSON())).toContain('Playback paused');
  await press('Skip founder presentation');
  expect(done).toHaveBeenCalledTimes(1);
});
it('exits automatically once when the playback clock finishes', async () => {
  jest
    .spyOn(FounderPlayback.prototype, 'tick')
    .mockImplementation(function (this: FounderPlayback) {
      this.skip();
    });
  const done = await mount();
  await act(async () => measure());
  await act(async () => {
    jest.advanceTimersByTime(100);
  });
  expect(done).toHaveBeenCalledTimes(1);
  await press('Skip founder presentation');
  expect(done).toHaveBeenCalledTimes(1);
});

it('keeps one fixed portrait behind the scroll view for the whole presentation', async () => {
  await mount();
  const background = renderer.root.findAllByProps({
    testID: 'founder-cinematic-background',
  })[0]!;
  expect(background.findByType(Image).props.resizeMode).toBe('cover');
  expect(
    renderer.root
      .findByType(ScrollView)
      .findAllByProps({ testID: 'founder-cinematic-background' }),
  ).toHaveLength(0);
  expect(
    renderer.root.findByType(ScrollView).findAllByType(Image),
  ).toHaveLength(0);
  await act(async () => measure());
  await act(() => renderer.root.findByType(ScrollView).props.onTouchStart());
  await press('Resume');
  expect(
    renderer.root.findAllByProps({
      testID: 'founder-cinematic-background',
    })[0]!,
  ).toBe(background);
});
it('preserves playback controls and initials fallback if the background portrait fails', async () => {
  const done = await mount();
  await act(() =>
    renderer.root
      .findAllByProps({ testID: 'founder-cinematic-background' })[0]!
      .findByType(Image)
      .props.onError({ nativeEvent: { error: 'unavailable' } }),
  );
  expect(
    renderer.root
      .findAllByProps({ testID: 'founder-cinematic-background' })[0]!
      .findAllByType(Image),
  ).toHaveLength(0);
  expect(JSON.stringify(renderer.toJSON())).toContain('SM');
  await press('Skip founder presentation');
  expect(done).toHaveBeenCalledTimes(1);
});

it('shows only the fixed portrait for three seconds, then starts the story from the measured bottom edge', async () => {
  await mount(jest.fn(), false);
  const foreground = () =>
    renderer.root.findAllByProps({
      testID: 'founder-cinematic-foreground',
    })[0]!;
  expect(StyleSheet.flatten(foreground().props.style).opacity).toBe(0);
  expect(foreground().props.accessibilityElementsHidden).toBe(true);
  await act(async () => measure());
  expect(
    StyleSheet.flatten(
      renderer.root.findByType(ScrollView).props.contentContainerStyle,
    ).paddingTop,
  ).toBe(600);
  await act(async () => {
    jest.advanceTimersByTime(2999);
  });
  expect(StyleSheet.flatten(foreground().props.style).opacity).toBe(0);
  await act(async () => {
    jest.advanceTimersByTime(1);
  });
  expect(foreground().props.accessibilityElementsHidden).toBe(false);
  expect(StyleSheet.flatten(foreground().props.style).opacity).not.toBe(0);
});
