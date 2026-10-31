import React from 'react';
import Renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import App from '../../App';
import { Button } from '../design-system/components';
import { SplashScreen } from '../features/onboarding/screens/SplashScreen';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { SolutionDetailsScreen } from '../features/solutions/screens/SolutionDetailsScreen';
import { ProjectDetailsScreen } from '../features/projects/screens/ProjectDetailsScreen';
import { GetQuoteScreen } from '../features/quote/screens/GetQuoteScreen';
import { ShowcaseCard } from '../features/home/components/ShowcaseCard';
import {
  AboutUsScreen,
  ClientsScreen,
} from '../features/company/screens/CompanyScreens';
import { ContactUsScreen } from '../features/contact/screens/ContactUsScreen';
import { createMemoryPreferences, createTestStore } from './createTestStore';
import { createRepositories } from '../app/dependencies/createRepositories';
import { RepositoryError } from '../core/errors/AppError';
import { rootApi } from '../app/store/rootApi';

describe('Phase 2 launch and Home experience', () => {
  let renderer: ReactTestRenderer;
  let store: ReturnType<typeof createTestStore>;
  async function mount(nextStore: ReturnType<typeof createTestStore>) {
    store = nextStore;
    await act(() => {
      renderer = Renderer.create(<App store={store} />);
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
  }
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

    const matches = renderer.root
      .findAllByType(Button)
      .filter(button => button.props.label === label);
    const button = matches[matches.length - 1];
    if (!button) {
      throw new Error(`Missing button: ${label}`);
    }
    await act(async () => {
      button.props.onPress();
    });
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
  }
  afterEach(async () => {
    await act(() => {
      renderer?.unmount();
      store?.dispatch(rootApi.util.resetApiState());
    });
  });
  it('shows branded splash only while hydration is pending, then onboarding', async () => {
    const preferences = createMemoryPreferences();
    let resolve!: (value: boolean) => void;
    jest.spyOn(preferences, 'getOnboardingCompleted').mockReturnValue(
      new Promise<boolean>(done => {
        resolve = done;
      }),
    );
    await mount(createTestStore({ preferences }));
    expect(renderer.root.findByType(SplashScreen)).toBeDefined();
    await act(async () => {
      resolve(false);
    });
    expect(renderer.root.findByType(OnboardingScreen)).toBeDefined();
  });
  it('walks through all three pages, persists completion, and skips onboarding on relaunch', async () => {
    const preferences = createMemoryPreferences();
    await mount(createTestStore({ preferences }));
    expect(JSON.stringify(renderer.toJSON())).toContain('Welcome to');
    await press('Next');
    expect(JSON.stringify(renderer.toJSON())).toContain('Explore Our');
    const page = renderer.root.findAllByProps({
      accessibilityLabel: 'Go to onboarding page 2',
    })[0];
    expect(page?.props.accessibilityState.selected).toBe(true);
    await press('Next');
    expect(JSON.stringify(renderer.toJSON())).toContain('Bring Your');
    await press('Get Started');
    expect(renderer.root.findByType(HomeScreen)).toBeDefined();
    expect(await preferences.getOnboardingCompleted()).toBe(true);
    await act(() => {
      renderer.unmount();
      store.dispatch(rootApi.util.resetApiState());
    });
    await mount(createTestStore({ preferences }));
    expect(renderer.root.findAllByType(OnboardingScreen)).toHaveLength(0);
    expect(renderer.root.findByType(HomeScreen)).toBeDefined();
  });
  it('keeps onboarding visible on save failure and lets Skip retry safely', async () => {
    const preferences = createMemoryPreferences();
    jest
      .spyOn(preferences, 'setOnboardingCompleted')
      .mockRejectedValueOnce(new Error('Storage unavailable'));
    await mount(createTestStore({ preferences }));
    const skip = () =>
      renderer.root.findAllByProps({
        accessibilityLabel: 'Skip onboarding',
      })[0]!;
    await act(async () => {
      skip().props.onPress();
    });
    expect(renderer.root.findByType(OnboardingScreen)).toBeDefined();
    expect(store.getState().onboarding.completed).toBe(false);
    expect(
      renderer.root.findAllByProps({ accessibilityRole: 'alert' }).length,
    ).toBeGreaterThan(0);
    await act(async () => {
      skip().props.onPress();
    });
    expect(renderer.root.findByType(HomeScreen)).toBeDefined();
  });
  it('offers a retry when startup preferences cannot be read', async () => {
    const preferences = createMemoryPreferences(true);
    jest
      .spyOn(preferences, 'getOnboardingCompleted')
      .mockRejectedValueOnce(new Error('Unavailable'));
    await mount(createTestStore({ preferences }));
    expect(renderer.root.findByType(SplashScreen).props.error).toBeTruthy();
    await press('Try again');
    expect(renderer.root.findByType(HomeScreen)).toBeDefined();
  });
  it('renders Home from repositories, retries failed sections, and handles empty projects', async () => {
    const repositories = createRepositories();
    jest
      .spyOn(repositories.solutions, 'list')
      .mockRejectedValueOnce(new RepositoryError('network', 'Unavailable'));
    jest.spyOn(repositories.projects, 'list').mockResolvedValue([]);
    await mount(
      createTestStore({
        repositories,
        preferences: createMemoryPreferences(true),
      }),
    );
    expect(JSON.stringify(renderer.toJSON())).toContain(
      'No items available yet.',
    );
    expect(renderer.root.findAllByType(ShowcaseCard)).toHaveLength(0);
    await press('Try again');
    expect(renderer.root.findAllByType(ShowcaseCard)).toHaveLength(3);
  });
  it('connects Home company, client, and contact calls to their existing routes', async () => {
    await mount(
      createTestStore({ preferences: createMemoryPreferences(true) }),
    );
    for (const [label, component] of [
      ['Our story', AboutUsScreen],
      ['Meet our clients', ClientsScreen],
      ['Contact our team', ContactUsScreen],
    ] as const) {
      await press(label);
      expect(renderer.root.findByType(component)).toBeDefined();
      await press('Back');
    }
  });
  it('opens every featured card and all quotation buttons from Home', async () => {
    await mount(
      createTestStore({ preferences: createMemoryPreferences(true) }),
    );
    const cards = renderer.root.findAllByType(ShowcaseCard);
    expect(cards).toHaveLength(5);
    const titles = cards.map(card => card.props.title);
    for (const [index, title] of titles.entries()) {
      const card = renderer.root.findAllByType(ShowcaseCard)[index]!;
      await act(async () => {
        card.props.onPress();
      });
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      const detail = renderer.root.findByType(
        index < 3 ? SolutionDetailsScreen : ProjectDetailsScreen,
      );
      expect(detail).toBeDefined();
      expect(JSON.stringify(renderer.toJSON())).toContain(title);
      await press('Back');
    }
    const quoteButtons = renderer.root
      .findAllByType(Button)
      .filter(button =>
        ['Get a quote', 'Start your project'].includes(button.props.label),
      );
    expect(quoteButtons).toHaveLength(3);
    for (let index = 0; index < 3; index++) {
      const button = renderer.root
        .findAllByType(Button)
        .filter(item =>
          ['Get a quote', 'Start your project'].includes(item.props.label),
        )[index]!;
      await act(async () => {
        button.props.onPress();
      });
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      expect(renderer.root.findByType(GetQuoteScreen)).toBeDefined();
      await press('Back');
    }
  });
});
