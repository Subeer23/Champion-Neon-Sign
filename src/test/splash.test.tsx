import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import {
  SplashScreen,
  splashLogoWidth,
} from '../features/onboarding/screens/SplashScreen';
import { BrandLogo } from '../design-system/components/BrandLogo';

describe('cinematic splash', () => {
  afterEach(() => jest.restoreAllMocks());
  it.each([240, 272, 320, 360, 390, 768, 1024])(
    'keeps the full logo within %s points',
    width => {
      expect(splashLogoWidth(width)).toBeLessThanOrEqual(width - 48);
      expect(splashLogoWidth(width)).toBeLessThanOrEqual(320);
    },
  );
  it('uses the source aspect ratio and skips motion when reduced motion is enabled', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);
    const timing = jest.spyOn(Animated, 'timing');
    let renderer!: Renderer.ReactTestRenderer;
    await act(async () => {
      renderer = Renderer.create(<SplashScreen />);
    });
    const logo = renderer.root.findByType(BrandLogo);
    const style = StyleSheet.flatten(logo.props.style);
    expect(style.width / style.height).toBeCloseTo(900 / 380);
    expect(timing).not.toHaveBeenCalled();
    expect(JSON.stringify(renderer.toJSON())).toContain(
      'VISION. CRAFT. IMPACT.',
    );
    expect(JSON.stringify(renderer.toJSON())).toContain(
      'Signage • Branding • Digital Experiences',
    );
    await act(() => renderer.unmount());
  });
  it('stops entrance animation when initialization navigates away', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    const stop = jest.fn();
    const start = jest.fn();
    jest
      .spyOn(Animated, 'timing')
      .mockReturnValue({ start, stop, reset: jest.fn() });
    let renderer!: Renderer.ReactTestRenderer;
    await act(async () => {
      renderer = Renderer.create(<SplashScreen />);
    });
    expect(start).toHaveBeenCalledTimes(1);
    await act(() => renderer.unmount());
    expect(stop).toHaveBeenCalled();
  });
});
