import { authReducer } from '../../features/auth/state/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { onboardingReducer } from '../../features/onboarding/state/onboardingSlice';
import type { AppDependencies } from '../dependencies/types';
import { rootApi } from './rootApi';
export function createAppStore(dependencies: AppDependencies) {
  const store = configureStore({
    reducer: {
      [rootApi.reducerPath]: rootApi.reducer,
      onboarding: onboardingReducer,
      auth: authReducer,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }).concat(
        rootApi.middleware,
      ),
  });
  return Object.assign(store, { demoRepository: dependencies.demo });
}
export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
