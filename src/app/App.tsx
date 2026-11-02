import { AppErrorBoundary } from '../shared/errors/AppErrorBoundary';
import React from 'react';
import { StatusBar } from 'react-native';
import { AppProviders } from './providers/AppProviders';
import { LaunchGate } from './navigation/LaunchGate';
import type { AppStore } from './store/store';
export default function App({ store }: { store?: AppStore }) {
  return (
    <AppErrorBoundary>
      <AppProviders store={store}>
        <StatusBar barStyle="light-content" />
        <LaunchGate />
      </AppProviders>
    </AppErrorBoundary>
  );
}
