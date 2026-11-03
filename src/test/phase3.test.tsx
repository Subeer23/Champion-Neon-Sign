import { skipFounderPresentation } from './skipFounderPresentation';
import React from 'react';
import Renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import { FlatList, Linking } from 'react-native';
import App from '../../App';
import { createMemoryPreferences, createTestStore } from './createTestStore';
import { rootApi } from '../app/store/rootApi';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { SolutionDetailsScreen } from '../features/solutions/screens/SolutionDetailsScreen';
import {
  GalleryViewerScreen,
  clampGalleryIndex,
} from '../features/projects/screens/GalleryViewerScreen';
import { GetQuoteScreen } from '../features/quote/screens/GetQuoteScreen';
import { FAQsScreen } from '../features/company/screens/CompanyScreens';
import { ContactUsScreen } from '../features/contact/screens/ContactUsScreen';
import { Header } from '../design-system/components/Header';
import { Button } from '../design-system/components';
import { IconButton } from '../shared/components/IconButton';
import { SearchField } from '../shared/components/SearchField';
import { filterContent } from '../shared/content/filterContent';
import { openContactLink } from '../features/contact/services/openContactLink';
import { solutionFixtures } from '../mocks/fixtures/solutions';
import { projectFixtures } from '../mocks/fixtures/projects';
import { companyContent } from '../mocks/fixtures/company';
import { sourceManifest } from '../mocks/sourceManifest';
import { getImage } from '../assets/images';
import type { TabScreenProps, RootScreenProps } from '../app/navigation/types';

describe('Phase 3 content and actions', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => jest.restoreAllMocks());
  it('has all 16 unique solutions, four showcases and locally resolvable media', () => {
    expect(solutionFixtures).toHaveLength(16);
    expect(new Set(solutionFixtures.map(item => item.id)).size).toBe(16);
    expect(projectFixtures).toHaveLength(4);
    expect(companyContent.faqs).toHaveLength(10);
    expect(companyContent.testimonials).toHaveLength(6);
    for (const item of solutionFixtures) {
      expect(
        sourceManifest.some(source => source.id === `solution:${item.id}`),
      ).toBe(true);
      if (item.imageId) expect(getImage(item.imageId)).toBeDefined();
    }
    for (const item of projectFixtures) {
      expect(new Set(item.imageIds).size).toBe(item.imageIds.length);
      item.imageIds.forEach(id => expect(getImage(id)).toBeDefined());
      item.solutionIds.forEach(id =>
        expect(solutionFixtures.some(solution => solution.id === id)).toBe(
          true,
        ),
      );
    }
    companyContent.clients.forEach(client =>
      expect(getImage(client.imageId)).toBeDefined(),
    );
  });
  it('combines project category and case-insensitive search, including empty results', () => {
    expect(
      filterContent(projectFixtures, ' LED ', 'LED Screens').map(
        item => item.id,
      ),
    ).toEqual(['led-screens']);
    expect(filterContent(projectFixtures, 'LED', 'Branding')).toEqual([]);
    expect(filterContent(projectFixtures, '')).toHaveLength(4);
    expect(filterContent(solutionFixtures, 'robot')).toHaveLength(1);
  });
  it.each([
    [-10, 3, 0],
    [99, 3, 2],
    [1, 3, 1],
    [3, 0, 0],
    [NaN, 3, 0],
  ])('clamps gallery index %s for %s images', (index, count, result) =>
    expect(clampGalleryIndex(index, count)).toBe(result),
  );
  it.each([
    companyContent.contact.telephoneUrl,
    `mailto:${companyContent.contact.email}`,
    companyContent.contact.whatsappUrl,
    companyContent.contact.mapsUrl,
  ])('opens supported contact action %s', async url => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await openContactLink(url);
    expect(open).toHaveBeenCalledWith(url);
  });
  it('rejects unavailable, failed and unsupported links', async () => {
    const can = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const open = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValue(new Error('Unavailable'));
    await expect(openContactLink('tel:+97142856595')).rejects.toThrow();
    expect(open).not.toHaveBeenCalled();
    can.mockResolvedValue(true);
    await expect(
      openContactLink(companyContent.contact.mapsUrl),
    ).rejects.toThrow();
    await expect(openContactLink('file:///invalid')).rejects.toThrow(
      'Unsupported',
    );
  });
});

describe('Phase 3 navigation and interaction', () => {
  let renderer: ReactTestRenderer;
  let store: ReturnType<typeof createTestStore>;
  beforeEach(async () => {
    jest.clearAllMocks();
    store = createTestStore({ preferences: createMemoryPreferences(true) });
    await act(() => {
      renderer = Renderer.create(<App store={store} />);
    });
    await settle();
  });
  afterEach(async () => {
    await act(() => {
      renderer.unmount();
      store.dispatch(rootApi.util.resetApiState());
    });
    jest.restoreAllMocks();
  });
  async function settle() {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    await skipFounderPresentation(renderer);
  }
  async function action(label: string) {
    const target = renderer.root.findAllByProps({
      accessibilityLabel: label,
    })[0];
    expect(target).toBeDefined();
    await act(async () => target!.props.onPress());
    await settle();
  }
  async function button(label: string) {
    const matches = renderer.root
      .findAllByType(Button)
      .filter(item => item.props.label === label);
    expect(matches.length).toBeGreaterThan(0);
    await act(async () => matches[matches.length - 1]!.props.onPress());
    await settle();
  }
  function navigation() {
    return (
      renderer.root.findByType(HomeScreen).props as TabScreenProps<'Home'>
    ).navigation;
  }
  it('opens all 16 typed solution routes, quote context and arrow back without visible Back text', async () => {
    for (const solution of solutionFixtures) {
      await act(() =>
        navigation().navigate('SolutionDetails', { solutionId: solution.id }),
      );
      await settle();
      const props = renderer.root.findByType(SolutionDetailsScreen)
        .props as RootScreenProps<'SolutionDetails'>;
      expect(props.route.params.solutionId).toBe(solution.id);
      expect(JSON.stringify(renderer.toJSON())).toContain(solution.summary);
      const header = renderer.root
        .findAllByType(Header)
        .find(item => item.props.onBack);
      expect(header).toBeDefined();
      expect(header!.findAllByType(IconButton)).toHaveLength(1);
      expect(header!.findAllByType(Button)).toHaveLength(0);
      await button('Request a quote');
      expect(
        (
          renderer.root.findByType(GetQuoteScreen)
            .props as RootScreenProps<'GetQuote'>
        ).route.params?.solutionId,
      ).toBe(solution.id);
      await action('Go back');
      await action('Go back');
    }
  });
  it('filters the project catalog and clears a no-results search', async () => {
    await button('View projects');
    await action('Filter LED Screens');
    let list = renderer.root.findByType(FlatList);
    expect(list.props.data.map((item: { id: string }) => item.id)).toEqual([
      'led-screens',
    ]);
    await act(() =>
      renderer.root.findByType(SearchField).props.onChangeText('unmatched'),
    );
    expect(renderer.root.findByType(FlatList).props.data).toHaveLength(0);
    expect(
      renderer.root.findByType(FlatList).props.ListEmptyComponent,
    ).toBeDefined();
    await act(() =>
      renderer.root.findByType(SearchField).props.onChangeText(''),
    );
    await action('Filter All');
    list = renderer.root.findByType(FlatList);
    expect(list.props.data).toHaveLength(4);
  });
  it('opens the requested gallery page, swipes and closes to Home', async () => {
    await act(() =>
      navigation().navigate('GalleryViewer', {
        projectId: 'led-screens',
        initialIndex: 1,
      }),
    );
    await settle();
    const gallery = renderer.root.findByType(GalleryViewerScreen);
    const list = gallery.findByType(FlatList);
    expect(list.props.initialScrollIndex).toBe(1);
    expect(JSON.stringify(renderer.toJSON())).toContain('2 / 3');
    const layout = list.props.getItemLayout(undefined, 2);
    await act(() =>
      list.props.onMomentumScrollEnd({
        nativeEvent: { contentOffset: { x: layout.offset } },
      }),
    );
    expect(JSON.stringify(renderer.toJSON())).toContain('3 / 3');
    await action('Close gallery');
    expect(renderer.root.findAllByType(GalleryViewerScreen)).toHaveLength(0);
  });
  it('searches and expands official FAQs with accessible state', async () => {
    await act(() => navigation().navigate('FAQs'));
    await settle();
    expect(renderer.root.findByType(FAQsScreen)).toBeDefined();
    await act(() =>
      renderer.root.findByType(SearchField).props.onChangeText('rent LED'),
    );
    const faq = companyContent.faqs[1]!;
    await action(faq.question);
    expect(JSON.stringify(renderer.toJSON())).toContain(faq.answer);
    expect(
      renderer.root.findAllByProps({ accessibilityLabel: faq.question })[0]!
        .props.accessibilityState.expanded,
    ).toBe(true);
    await action(faq.question);
    expect(
      renderer.root.findAllByProps({ accessibilityLabel: faq.question })[0]!
        .props.accessibilityState.expanded,
    ).toBe(false);
  });
  it('shows recoverable contact errors and permits another action', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await act(() => navigation().navigate('ContactUs'));
    await settle();
    expect(renderer.root.findByType(ContactUsScreen)).toBeDefined();
    await action('Call Champion Group');
    expect(
      renderer.root.findAllByProps({ accessibilityRole: 'alert' }).length,
    ).toBeGreaterThan(0);
    expect(open).not.toHaveBeenCalled();
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    await action('Open Maps');
    expect(open).toHaveBeenCalledWith(companyContent.contact.mapsUrl);
  });
});
