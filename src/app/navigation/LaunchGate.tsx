import { AuthNavigator } from '../../features/auth/screens/AuthScreens';
import { Alert } from 'react-native';
import {
  clearLocalDemo,
  hydrateDemoAccess,
} from '../../features/auth/state/authSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hydrateOnboarding } from '../../features/onboarding/state/onboardingSlice';
import { SplashScreen } from '../../features/onboarding/screens/SplashScreen';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { LaunchReveal } from '../../features/onboarding/components/LaunchReveal';
import { RootNavigator } from './RootNavigator';
export const MIN_SPLASH_DURATION_MS = 3000;
export function LaunchGate() {
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(
      () => setMinimumDurationElapsed(true),
      MIN_SPLASH_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, []);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const finishEntrance = useCallback(() => setEntranceComplete(true), []);
  const { status, completed, error } = useAppSelector(
    state => state.onboarding,
  );
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);
  if (
    !minimumDurationElapsed ||
    !entranceComplete ||
    status === 'idle' ||
    status === 'loading' ||
    status === 'error' ||
    auth.status === 'idle' ||
    auth.status === 'loading' ||
    auth.status === 'error'
  ) {
    return (
      <SplashScreen
        onEntranceComplete={finishEntrance}
        onClearDemoData={
          auth.status === 'error'
            ? () =>
                Alert.alert(
                  'Clear local demo data?',
                  'All demo accounts and their local drafts, saves and notifications will be removed. Onboarding and company content stay intact.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear demo data',
                      style: 'destructive',
                      onPress: () => dispatch(clearLocalDemo()),
                    },
                  ],
                )
            : undefined
        }
        error={status === 'error' ? error : auth.error}
        onRetry={() => {
          dispatch(hydrateOnboarding());
          dispatch(hydrateDemoAccess());
        }}
      />
    );
  }
  return (
    <LaunchReveal>
      {!completed ? (
        <OnboardingScreen />
      ) : auth.access ? (
        <RootNavigator />
      ) : (
        <AuthNavigator />
      )}
    </LaunchReveal>
  );
}
