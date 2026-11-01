import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { Image, StyleSheet } from 'react-native';
import { ContentMedia } from '../shared/components/ContentMedia';
import { BrandImage } from '../design-system/components/BrandImage';
import { getImage } from '../assets/images';
import { solutionFixtures } from '../mocks/fixtures/solutions';
import { projectFixtures } from '../mocks/fixtures/projects';
import sources from '../assets/images/visual-selection-sources.json';

it('resolves each selected photograph and documents official provenance and screen usage', () => {
  for (const item of sources) {
    expect(getImage(item.imageId)).toBeDefined();
    expect(item.sourceUrl).toMatch(/^https:\/\/championgroup\.ae\//);
    expect(item.screens.length).toBeGreaterThan(0);
  }
  expect(solutionFixtures.find(item => item.id === 'signage')?.imageId).toBe(
    'events-showcase',
  );
  expect(solutionFixtures.find(item => item.id === 'outdoor')?.imageId).toBe(
    'led-display',
  );
  expect(solutionFixtures.filter(item => !item.imageId)).toHaveLength(9);
  expect(projectFixtures.flatMap(item => item.imageIds)).not.toContain(
    'events-illustration',
  );
  expect(projectFixtures.flatMap(item => item.imageIds)).not.toContain(
    'exhibition-stand-b',
  );
  expect(getImage('events-illustration')).toBeUndefined();
});
it('preserves a portrait billboard inside card and detail frames without cover cropping', async () => {
  const resolve = jest
    .spyOn(Image, 'resolveAssetSource')
    .mockReturnValue({ uri: 'local', width: 576, height: 1024, scale: 1 });
  let renderer!: Renderer.ReactTestRenderer;
  try {
    await act(() => {
      renderer = Renderer.create(
        <ContentMedia imageId="led-display" title="Outdoor" />,
      );
    });
    let media = renderer.root.findByType(BrandImage);
    expect(media.props.resizeMode).toBe('contain');
    expect(StyleSheet.flatten(media.props.style).aspectRatio).toBe(1.6);
    await act(() =>
      renderer.update(
        <ContentMedia detail imageId="led-display" title="Outdoor" />,
      ),
    );
    media = renderer.root.findByType(BrandImage);
    expect(media.props.resizeMode).toBe('contain');
    expect(StyleSheet.flatten(media.props.style).aspectRatio).toBe(0.8);
  } finally {
    await act(() => renderer?.unmount());
    resolve.mockRestore();
  }
});
