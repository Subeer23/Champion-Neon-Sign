import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from './providers/AppProviders';
import { RootNavigator } from './navigation/RootNavigator';
import type { AppStore } from './store/store';
export default function App({ store }: { store?: AppStore }) {
  return (
    <AppProviders store={store}>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProviders>
  );
}
