import React from 'react';
import { Image, Linking } from 'react-native';
import Renderer, { act } from 'react-test-renderer';
import { Button } from '../design-system/components';
import {
  founderContent,
  founderSources,
} from '../features/founder/data/founderContent';
import {
  FounderInitials,
  FounderPortrait,
  FounderSpotlight,
} from '../features/founder/components/FounderSpotlight';
import { FounderJourneyScreen } from '../features/founder/screens/FounderJourneyScreen';
import type { FounderSourceId } from '../features/founder/domain/FounderContent';

beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());
it('traces all factual sections and timeline milestones to reviewed full-text sources', () => {
  const entries = [
    founderContent.name,
    founderContent.designation,
    founderContent.introduction,
    ...founderContent.sections,
    ...founderContent.timeline,
  ];
  for (const item of entries) {
    expect(item.text.trim().length).toBeGreaterThan(0);
    expect(item.sourceIds.length).toBeGreaterThan(0);
    for (const id of item.sourceIds) {
      const source = founderSources[id];
      expect(source.id).toBe(id);
      expect(source.access).toBe('full-text');
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.publication).toBeTruthy();
      expect(source.title).toBeTruthy();
      expect(source.reviewedOn).toBe('2026-11-03');
    }
  }
  expect(new Set(founderContent.sections.map(item => item.id)).size).toBe(
    founderContent.sections.length,
  );
  expect(new Set(founderContent.timeline.map(item => item.id)).size).toBe(
    founderContent.timeline.length,
  );
  expect(founderSources.kt2006.access).toBe('indexed-excerpt');
  expect(founderSources.official.date).toBeNull();
  expect(founderSources.gn2019.dateKind).toBe('updated');
  expect(founderSources.retail2026.dateKind).toBe('upload');
});
it('keeps disputed ages, dimensions, financing and joining-year claims out of story text', () => {
  const text = [
    founderContent.introduction.text,
    ...founderContent.sections.map(item => item.text),
    ...founderContent.timeline.map(item => `${item.period} ${item.text}`),
  ].join(' ');
  expect(text).not.toMatch(
    /800|150\s*(sq|square)|17.year.old|18.year.old|2012|2013|bank loan|millionaire|award/i,
  );
  expect(
    founderContent.timeline.find(item => item.id === 'champion')?.period,
  ).toBe('1989');
  expect(
    founderContent.sections.find(item => item.id === 'dubai')?.text,
  ).toContain('Hanif Merchant');
  expect(
    founderContent.sections.find(item => item.id === 'family')?.text,
  ).toContain('Shazil');
});
it('keeps an accessible initials fallback available', async () => {
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(<FounderInitials />);
  });
  expect(founderContent.portrait.approval).toBe('user-provided');
  expect(renderer.root.findAllByType(Image)).toHaveLength(0);
  expect(
    renderer.root.findAllByProps({
      accessibilityLabel: 'Shabbir Merchant initials placeholder',
    }).length,
  ).toBeGreaterThan(0);
  expect(JSON.stringify(renderer.toJSON())).toContain('SM');
  await act(() => renderer.unmount());
});
it('opens the dedicated journey from the spotlight', async () => {
  const onOpen = jest.fn();
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(<FounderSpotlight onOpen={onOpen} />);
  });
  await act(() => renderer.root.findByType(Button).props.onPress());
  expect(onOpen).toHaveBeenCalledTimes(1);
  await act(() => renderer.unmount());
});
it('renders the complete bounded story, timeline and all reference links', async () => {
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(
      <FounderJourneyScreen
        navigation={{} as never}
        route={{ name: 'FounderJourney', key: 'founder' }}
      />,
    );
  });
  const text = JSON.stringify(renderer.toJSON());
  for (const section of founderContent.sections)
    expect(text).toContain(section.title);
  for (const milestone of founderContent.timeline)
    expect(text).toContain(milestone.period);
  expect(text).toContain('Sources & References');
  expect(renderer.root.findAllByType(Button)).toHaveLength(
    Object.keys(founderSources).length,
  );
  await act(() => renderer.unmount());
});
it.each(Object.keys(founderSources) as FounderSourceId[])(
  'opens the verified %s reference through Linking',
  async id => {
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    let renderer!: Renderer.ReactTestRenderer;
    await act(async () => {
      renderer = Renderer.create(
        <FounderJourneyScreen
          navigation={{} as never}
          route={{ name: 'FounderJourney', key: 'founder' }}
        />,
      );
    });
    const index = Object.keys(founderSources).indexOf(id);
    await act(async () => {
      await renderer.root.findAllByType(Button)[index]!.props.onPress();
    });
    expect(open).toHaveBeenCalledWith(founderSources[id].url);
    await act(() => renderer.unmount());
  },
);
it('shows a recoverable reference error when no browser can open the source', async () => {
  const open = jest
    .spyOn(Linking, 'openURL')
    .mockRejectedValueOnce(new Error('No browser'))
    .mockResolvedValue(undefined);
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(
      <FounderJourneyScreen
        navigation={{} as never}
        route={{ name: 'FounderJourney', key: 'founder' }}
      />,
    );
  });
  await act(async () => {
    await renderer.root.findAllByType(Button)[0]!.props.onPress();
  });
  expect(JSON.stringify(renderer.toJSON())).toContain(
    'Unable to open this reference',
  );
  await act(async () => {
    await renderer.root.findAllByType(Button)[0]!.props.onPress();
  });
  expect(open).toHaveBeenCalledTimes(2);
  expect(JSON.stringify(renderer.toJSON())).not.toContain(
    'Unable to open this reference',
  );
  await act(() => renderer.unmount());
});

it('renders the supplied local portrait and falls back to initials if loading fails', async () => {
  let renderer!: Renderer.ReactTestRenderer;
  await act(async () => {
    renderer = Renderer.create(<FounderPortrait large />);
  });
  const image = renderer.root.findByType(Image);
  expect(image.props.accessibilityLabel).toBe('Shabbir Merchant');
  expect(founderContent.portrait.imageId).toBe('shabbir-merchant');
  await act(() => image.props.onError({ nativeEvent: { error: 'failed' } }));
  expect(renderer.root.findAllByType(Image)).toHaveLength(0);
  expect(JSON.stringify(renderer.toJSON())).toContain('SM');
  await act(() => renderer.unmount());
});
