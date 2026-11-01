import React from 'react';
import { TextInput } from 'react-native';
import Renderer, { act, type ReactTestRenderer } from 'react-test-renderer';
import App from '../../App';
import { QuotationDetailsScreen } from '../features/account/screens/AccountCollectionScreens';
import { Button } from '../design-system/components';
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
  it('validates a local quote preview while preserving guest access', async () => {
    await press('Continue as guest');
    await press('Start your project');
    await press('Preview Request');
    expect(JSON.stringify(renderer.toJSON())).toContain('Complete the name');
    await fill('Full Name', 'Demo Visitor');
    await fill('Email Address', 'demo@example.com');
    await fill('Message', 'A sample signage request.');
    await press('Select a service');
    await press('Choose Signage');
    await press('Preview Request');
    expect(JSON.stringify(renderer.toJSON())).toContain('Preview ready');
    expect(store.getState().auth.access).toBe('guest');
    expect(JSON.stringify(store.getState())).not.toContain(
      'A sample signage request.',
    );
    await press('Contact our team');
    expect(
      renderer.root.findAllByProps({ accessibilityLabel: 'Open Maps' }).length,
    ).toBeGreaterThan(0);
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
    await fill('Message', 'A detailed local project request.');
    await press('Select a service');
    await press('Choose Signage');
    await press('Preview Request');
    await press('Save Demo Quotation');
    expect(store.demoRepository.getSnapshot().quotations).toHaveLength(1);
    expect(store.demoRepository.getSnapshot().notifications).toHaveLength(1);
    await press('View Saved Quotation');
    expect(renderer.root.findAllByType(QuotationDetailsScreen).length).toBe(1);
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
