import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AppDependencies } from '../../../app/dependencies/types';
interface OnboardingState {
  completed: boolean;
  status: 'idle' | 'loading' | 'ready' | 'error';
  saving: boolean;
  error: string | null;
}
const initialState: OnboardingState = {
  completed: false,
  status: 'idle',
  saving: false,
  error: null,
};
type ThunkConfig = { extra: AppDependencies; rejectValue: string };
export const hydrateOnboarding = createAsyncThunk<boolean, void, ThunkConfig>(
  'onboarding/hydrate',
  async (_, { extra, rejectWithValue }) => {
    try {
      return await extra.preferences.getOnboardingCompleted();
    } catch {
      return rejectWithValue('Preferences could not be loaded.');
    }
  },
);
export const saveOnboardingCompleted = createAsyncThunk<
  boolean,
  boolean,
  ThunkConfig
>('onboarding/save', async (completed, { extra, rejectWithValue }) => {
  try {
    await extra.preferences.setOnboardingCompleted(completed);
    return completed;
  } catch {
    return rejectWithValue('Preferences could not be saved.');
  }
});
const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(hydrateOnboarding.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(hydrateOnboarding.fulfilled, (state, action) => {
        state.completed = action.payload;
        state.status = 'ready';
      })
      .addCase(hydrateOnboarding.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Preferences unavailable.';
      })
      .addCase(saveOnboardingCompleted.pending, state => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveOnboardingCompleted.fulfilled, (state, action) => {
        state.completed = action.payload;
        state.saving = false;
      })
      .addCase(saveOnboardingCompleted.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Preferences unavailable.';
      }),
});
export const onboardingReducer = onboardingSlice.reducer;
