import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Path } from 'react-native-svg';
import { IconButton } from '../shared/components/IconButton';
import { Image, Linking, Platform, StyleSheet } from 'react-native';
import { BrandImage } from '../design-system/components/BrandImage';
import {
  openContactLink,
  mapsSearchFallback,
} from '../features/contact/services/openContactLink';
import { companyContent } from '../mocks/fixtures/company';

describe('verified Maps destination and fallbacks', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());
  it('targets the business CID from the official embed, not its viewport', () => {
    expect(companyContent.contact.mapsUrl).toBe(
      `https://www.google.com/maps?cid=${BigInt(
        '0x944cdf610b8a58fd',
      ).toString()}`,
    );
    expect(decodeURIComponent(mapsSearchFallback)).toContain(
      'Champion Neon Headquarters, Champion Group, Dubai Investments Park 2, Dubai, UAE',
    );
  });
  it.each(['android', 'ios'] as const)(
    'opens the universal business link on %s even if scheme discovery is restricted',
    async os => {
      const original = Platform.OS;
      Object.defineProperty(Platform, 'OS', { value: os, configurable: true });
      try {
        const can = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
        const open = jest
          .spyOn(Linking, 'openURL')
          .mockResolvedValue(undefined);
        await openContactLink(companyContent.contact.mapsUrl);
        expect(open).toHaveBeenCalledWith(companyContent.contact.mapsUrl);
        expect(can).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(Platform, 'OS', {
          value: original,
          configurable: true,
        });
      }
    },
  );
  it('falls back to a business-and-address browser search after a rejected map link', async () => {
    const open = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValueOnce(new Error('No handler'))
      .mockResolvedValueOnce(undefined);
    await expect(
      openContactLink(companyContent.contact.mapsUrl),
    ).resolves.toBeUndefined();
    expect(open).toHaveBeenNthCalledWith(2, mapsSearchFallback);
  });
  it('propagates failure when both map attempts fail so the contact screen can recover', async () => {
    const open = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValue(new Error('No browser'));
    await expect(
      openContactLink(companyContent.contact.mapsUrl),
    ).rejects.toThrow('No browser');
    expect(open).toHaveBeenCalledTimes(2);
  });
});

it('recovers a failed image when the source changes without an effect or stale fallback', async () => {
  let renderer!: Renderer.ReactTestRenderer;
  await act(() => {
    renderer = Renderer.create(
      <BrandImage source={{ uri: 'first' }} accessibilityLabel="First" />,
    );
  });
  await act(() =>
    renderer.root
      .findByType(Image)
      .props.onError({ nativeEvent: { error: 'failed' } }),
  );
  expect(renderer.root.findAllByType(Image)).toHaveLength(0);
  await act(() =>
    renderer.update(
      <BrandImage source={{ uri: 'second' }} accessibilityLabel="Second" />,
    ),
  );
  expect(renderer.root.findByType(Image).props.source).toEqual({
    uri: 'second',
  });
  await act(() => renderer.unmount());
});

it('keeps the shared back arrow visible on both dark button surfaces', async () => {
  for (const dark of [false, true]) {
    let renderer!: Renderer.ReactTestRenderer;
    const onPress = jest.fn();
    await act(() => {
      renderer = Renderer.create(
        <IconButton label="Go back" dark={dark} onPress={onPress} />,
      );
    });
    const button = renderer.root.findAllByProps({
      accessibilityLabel: 'Go back',
    })[0]!;
    const background = StyleSheet.flatten(
      typeof button.props.style === 'function'
        ? button.props.style({ pressed: false })
        : button.props.style,
    ).backgroundColor;
    expect(renderer.root.findByType(Path).props.stroke).toBe('#FFFFFF');
    expect(renderer.root.findByType(Path).props.stroke).not.toBe(background);
    await act(() => button.props.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
    await act(() => renderer.unmount());
  }
});
