import { skipFounderPresentation } from './skipFounderPresentation';
import { guestQuoteHandoff } from '../features/quote/state/guestQuoteHandoff';
import React from 'react';
import { Alert, TextInput } from 'react-native';
import Renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import App from '../../App';
import { QuotationDetailsScreen } from '../features/account/screens/AccountCollectionScreens';
import { AppText, Button } from '../design-system/components';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { createMemoryPreferences, createTestStore } from './createTestStore';
import { rootApi } from '../app/store/rootApi';

describe('demo authentication navigation', () => {
  let renderer: ReactTestRenderer;
  let store: ReturnType<typeof createTestStore>;
  async function settle() {
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    await skipFounderPresentation(renderer);
  }
  async function press(label: string) {
    const buttons = renderer.root
      .findAllByType(Button)
      .filter(item => item.props.label === label);
    const target =
      buttons.at(-1) ??
      renderer.root.findAllByProps({ accessibilityLabel: label })[0];
    if (!target) throw new Error('Missing action: ' + label);
    await act(async () => {
      target.props.onPress();
    });
    await settle();
  }
  async function fill(label: string, value: string) {
    const targets = renderer.root
      .findAllByType(TextInput)
      .filter(item => item.props.accessibilityLabel === label);
    await act(async () => {
      targets.at(-1)!.props.onChangeText(value);
    });
  }
  beforeEach(async () => {
    await guestQuoteHandoff.clear();
    const preferences = createMemoryPreferences(true);
    await preferences.setDemoAccess?.(null);
    store = createTestStore({ preferences });
    await act(async () => {
      renderer = Renderer.create(<App store={store} />);
    });
    await settle();
  });
  afterEach(async () => {
    await act(async () => {
      renderer.unmount();
      store.dispatch(rootApi.util.resetApiState());
    });
  });
  it('opens login, displays a preview, persists demo access and logs out', async () => {
    await store.demoRepository.signUp(
      'Demo Visitor',
      'demo@example.com',
      'Sample123!',
      '+971500000000',
    );
    await store.demoRepository.setAccess(null);
    await press('Already have a demo account? Login');
    await fill('Email Address', 'demo@example.com');
    await fill('Password', 'Sample123!');
    await press('Login');
    expect(store.getState().auth.access).toBeNull();
    await press('Explore Demo Home');
    expect(renderer.root.findAllByType(HomeScreen).length).toBe(1);
    expect(store.getState().auth.access).toBe('demo');
    await press('Open Profile');
    await press('Logout of Demo');
    expect(store.getState().auth.access).toBeNull();
    expect(renderer.root.findAllByType(HomeScreen).length).toBe(0);
    await press('Continue as guest');
    expect(store.getState().auth.access).toBe('guest');
  });
  it('requires signup consent before the demo Home preview', async () => {
    await press('Get Started');
    await fill('Full Name', 'Demo Visitor');
    await fill('Phone Number', '+971500000000');
    await fill('Email Address', 'demo@example.com');
    await fill('Password', 'Sample123!');
    await fill('Confirm Password', 'Sample123!');
    await press('Sign Up');
    expect(
      renderer.root.findAllByProps({ accessibilityRole: 'alert' }).length,
    ).toBeGreaterThan(0);
    await press('I understand this is a demo account');
    await press('Sign Up');
    await press('Explore Demo Home');
    expect(store.getState().auth.access).toBe('demo');
  });
  it('validates step navigation and restores a guest request after login', async () => {
    await store.demoRepository.signUp(
      'Demo Visitor',
      'demo@example.com',
      'Sample123!',
      '+971500000000',
    );
    await store.demoRepository.setAccess(null);
    await press('Continue as guest');
    await press('Start your project');
    await press('Continue');
    expect(JSON.stringify(renderer.toJSON())).toContain(
      'Select a solution to continue',
    );
    await press('Signage');
    await press('Continue');
    await fill('Project title', 'Guest shopfront');
    await fill('Project description', 'A sample signage request.');
    await fill('Project location', 'Dubai');
    const discardPrompt = jest.spyOn(Alert, 'alert');
    await press('Go back');
    expect(discardPrompt).toHaveBeenCalledWith(
      'Leave this request?',
      expect.any(String),
      expect.any(Array),
    );
    discardPrompt.mockRestore();
    await press('Continue');
    await press('Previous step');
    expect(JSON.stringify(renderer.toJSON())).toContain('Guest shopfront');
    await press('Continue');
    expect(store.getState().auth.access).toBe('guest');
    await press('Login and keep draft');
    await fill('Email Address', 'demo@example.com');
    await fill('Password', 'Sample123!');
    await press('Login');
    await press('Explore Demo Home');
    expect(store.demoRepository.getSnapshot().quotations[0]?.form?.title).toBe(
      'Guest shopfront',
    );
    await press('Continue');
    expect(JSON.stringify(renderer.toJSON())).toContain('Guest shopfront');
    await press('Edit project');
    await fill('Project title', 'Updated guest project');
    await press('Continue');
    await press('Continue');
    await press('Submit Request');
    expect(store.demoRepository.getSnapshot().quotations[0]?.status).toBe(
      'Submitted (Demo)',
    );
  });
  it('connects profile inner screens, saves a quotation and updates local notification state', async () => {
    await store.demoRepository.signUp(
      'Demo Visitor',
      'demo@example.com',
      'Sample123!',
      '+971500000000',
    );
    await press('Already have a demo account? Login');
    await fill('Email Address', 'demo@example.com');
    await fill('Password', 'Sample123!');
    await press('Login');
    await press('Explore Demo Home');
    await press('Open Profile');
    await press('Edit Profile');
    await fill('Full Name', 'Updated Visitor');
    await press('Save Profile');
    expect(store.demoRepository.getSnapshot().profile?.name).toBe(
      'Updated Visitor',
    );
    await press('Go back');
    for (const label of [
      'Change Password',
      'Saved Projects',
      'Notifications',
      'Help & Support',
      'Privacy Policy',
      'Terms & Conditions',
      'About Champion Group',
      'App Settings',
    ]) {
      await press(label);
      await press('Go back');
    }
    await press('My Quotations');
    await press('Create demo quotation');
    await press('Signage');
    await press('Continue');
    await fill('Project title', 'A local project');
    await fill('Project description', 'A detailed local project request.');
    await fill('Project location', 'Dubai');
    await press('Continue');
    await press('Continue');
    await press('Save draft');
    expect(store.demoRepository.getSnapshot().quotations[0]?.status).toBe(
      'Draft',
    );
    await press('Go back');
    await press('View demo');
    await press('Continue editing draft');
    expect(
      renderer.root
        .findAllByType(AppText)
        .some(node => String(node.props.children).includes('A local project')),
    ).toBe(true);
    await press('Submit Request');
    expect(store.demoRepository.getSnapshot().quotations).toHaveLength(1);
    expect(store.demoRepository.getSnapshot().notifications).toHaveLength(1);
    await press('View My Quotations');
    await press('View demo');
    expect(
      renderer.root.findAllByType(QuotationDetailsScreen).at(-1)!.props.route
        .params.quotationId,
    ).toBe(store.demoRepository.getSnapshot().quotations[0]!.id);
  });
  it('navigates the complete reset preview with a pasted six-digit code', async () => {
    await store.demoRepository.signUp(
      'Demo Visitor',
      'demo@example.com',
      'Sample123!',
      '+971500000000',
    );
    await store.demoRepository.setAccess(null);
    const requestReset = jest.spyOn(store.demoRepository, 'requestReset');
    await press('Already have a demo account? Login');
    await press('Forgot Password?');
    await fill('Email Address', 'demo@example.com');
    await press('Generate Demo Code');
    await fill(
      'Code digit 1',
      (
        await requestReset.mock.results[0]!.value
      ).code,
    );
    await press('Verify Demo Code');
    await fill('New Password', 'Sample123!');
    await fill('Confirm New Password', 'Sample123!');
    await press('Update Demo Password');
    expect(JSON.stringify(renderer.toJSON())).toContain('Demo Complete');
    await press('Go to Login');
    expect(
      renderer.root
        .findAllByType(TextInput)
        .some(item => item.props.accessibilityLabel === 'Password'),
    ).toBe(true);
    expect(store.getState().auth.access).toBeNull();
  });
});
