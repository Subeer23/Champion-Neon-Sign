import { configureStore } from '@reduxjs/toolkit';
import { onboardingReducer } from '../../features/onboarding/state/onboardingSlice';
import type { AppDependencies } from '../dependencies/types';
import { rootApi } from './rootApi';
export function createAppStore(dependencies: AppDependencies) {
  return configureStore({
    reducer: {
      [rootApi.reducerPath]: rootApi.reducer,
      onboarding: onboardingReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }).concat(
        rootApi.middleware,
      ),
  });
}
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
