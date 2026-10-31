import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createPreferencesStorage } from '../../core/storage/AsyncPreferencesStorage';
import { colors } from '../../design-system/tokens/colors';
import { hydrateOnboarding } from '../../features/onboarding/state/onboardingSlice';
import { createRepositories } from '../dependencies/createRepositories';
import { createAppStore, type AppStore } from '../store/store';
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};
export function AppProviders({
  children,
  store: suppliedStore,
}: PropsWithChildren<{ store?: AppStore }>) {
  const [store] = useState(
    () =>
      suppliedStore ??
      createAppStore({
        repositories: createRepositories(),
        preferences: createPreferencesStorage(),
      }),
  );
  useEffect(() => {
    if (store.getState().onboarding.status === 'idle') {
      store.dispatch(hydrateOnboarding());
    }
  }, [store]);
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>
          {children}
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
