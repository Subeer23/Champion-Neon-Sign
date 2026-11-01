import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hydrateOnboarding } from '../../features/onboarding/state/onboardingSlice';
import { SplashScreen } from '../../features/onboarding/screens/SplashScreen';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { LaunchReveal } from '../../features/onboarding/components/LaunchReveal';
import { RootNavigator } from './RootNavigator';
export function LaunchGate() {
  const { status, completed, error } = useAppSelector(
    state => state.onboarding,
  );
  const dispatch = useAppDispatch();
  if (status === 'idle' || status === 'loading' || status === 'error') {
    return (
      <SplashScreen
        error={status === 'error' ? error : null}
        onRetry={() => dispatch(hydrateOnboarding())}
      />
    );
  }
  return (
    <LaunchReveal>
      {completed ? <RootNavigator /> : <OnboardingScreen />}
    </LaunchReveal>
  );
}
