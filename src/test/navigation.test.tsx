import { skipFounderPresentation } from './skipFounderPresentation';
import { FounderJourneyScreen } from '../features/founder/screens/FounderJourneyScreen';
import React from 'react';
import Renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import App from '../../App';
import { Button } from '../design-system/components';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { SolutionsScreen } from '../features/solutions/screens/SolutionsScreen';
import { SolutionDetailsScreen } from '../features/solutions/screens/SolutionDetailsScreen';
import { ProjectsScreen } from '../features/projects/screens/ProjectsScreen';
import { ProjectDetailsScreen } from '../features/projects/screens/ProjectDetailsScreen';
import { GalleryViewerScreen } from '../features/projects/screens/GalleryViewerScreen';
import { MoreScreen } from '../features/company/screens/MoreScreen';
import {
  AboutUsScreen,
  ClientsScreen,
  TestimonialsScreen,
  FAQsScreen,
} from '../features/company/screens/CompanyScreens';
import { ContactUsScreen } from '../features/contact/screens/ContactUsScreen';
import { GetQuoteScreen } from '../features/quote/screens/GetQuoteScreen';
import type { TabScreenProps, RootScreenProps } from '../app/navigation/types';
import { rootApi } from '../app/store/rootApi';
import { createTestStore, createMemoryPreferences } from './createTestStore';

describe('real navigation tree', () => {
  let renderer: ReactTestRenderer;
  let store: ReturnType<typeof createTestStore>;
  beforeEach(async () => {
    store = createTestStore({ preferences: createMemoryPreferences(true) });
    await act(() => {
      renderer = Renderer.create(<App store={store} />);
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    await skipFounderPresentation(renderer);
  });
  afterEach(async () => {
    await act(() => {
      renderer.unmount();
      store.dispatch(rootApi.util.resetApiState());
    });
  });
  async function press(label: string) {
    if (label === 'Back') {
      await act(async () => {
        renderer.root
          .findAllByProps({ accessibilityLabel: 'Go back' })[0]!
          .props.onPress();
      });
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      return;
    }

    const buttons = renderer.root
      .findAllByType(Button)
      .filter(button => button.props.label === label);
    const button = buttons[buttons.length - 1];
    if (!button) {
      const target = renderer.root.findAllByProps({
        accessibilityLabel: label,
      })[0];
      if (!target) {
        throw new Error(`Missing action: ${label}`);
      }
      await act(async () => {
        target.props.onPress();
      });
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      return;
    }
    await act(async () => {
      button.props.onPress();
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
  }
  it('opens a solution and carries its ID into the quote placeholder', async () => {
    await press('Explore solutions');
    expect(renderer.root.findByType(SolutionsScreen)).toBeDefined();
    await press('Explore Signage');
    expect(renderer.root.findByType(SolutionDetailsScreen)).toBeDefined();
    await press('Request a quote');
    const props = renderer.root.findByType(GetQuoteScreen)
      .props as RootScreenProps<'GetQuote'>;
    expect(props.route.params).toEqual({ solutionId: 'signage' });
  });
  it('opens projects, the gallery modal, and returns to the project', async () => {
    await press('View projects');
    expect(renderer.root.findByType(ProjectsScreen)).toBeDefined();
    await press('View Branding');
    expect(renderer.root.findByType(ProjectDetailsScreen)).toBeDefined();
    await press('Open gallery');
    const gallery = renderer.root.findByType(GalleryViewerScreen)
      .props as RootScreenProps<'GalleryViewer'>;
    expect(gallery.route.params.projectId).toBe('branding');
    await act(() => gallery.navigation.goBack());
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    await press('Enquire about this project');
    const quote = renderer.root.findByType(GetQuoteScreen)
      .props as RootScreenProps<'GetQuote'>;
    expect(quote.route.params).toEqual({
      projectId: 'branding',
      solutionId: 'branding',
    });
  });
  it('reaches every More destination and supports back navigation', async () => {
    const home = renderer.root.findByType(HomeScreen)
      .props as TabScreenProps<'Home'>;
    await act(() => home.navigation.navigate('More'));
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(renderer.root.findByType(MoreScreen)).toBeDefined();
    for (const [label, component] of [
      ['About Us', AboutUsScreen],
      ['Clients', ClientsScreen],
      ['Testimonials', TestimonialsScreen],
      ['FAQs', FAQsScreen],
      ['Contact Us', ContactUsScreen],
    ] as const) {
      await press(label);
      expect(renderer.root.findByType(component)).toBeDefined();
      await press('Back');
    }
    await press('Get a Quote');
    expect(renderer.root.findByType(GetQuoteScreen)).toBeDefined();
  });
  it('keeps Home free of the founder card and opens the manual journey from About', async () => {
    expect(
      renderer.root
        .findAllByType(Button)
        .some(item => item.props.label === 'Explore Founder Journey'),
    ).toBe(false);
    await press('Our story');
    expect(renderer.root.findByType(AboutUsScreen)).toBeDefined();
    await press('Explore Founder Journey');
    const journey = renderer.root.findAllByType(FounderJourneyScreen).at(-1)!;
    expect(journey.props.route.name).toBe('FounderJourney');
    await press('Back');
    expect(renderer.root.findByType(AboutUsScreen)).toBeDefined();
  });
});
