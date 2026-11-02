import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { AppDependencies } from '../../../app/dependencies/types';
import type { DemoAccess } from '../domain/AuthRepository';
interface State {
  access: DemoAccess;
  entry: 'Welcome' | 'Login' | 'SignUp';
  status: 'idle' | 'loading' | 'ready' | 'error';
  saving: boolean;
  error: string | null;
}
const initialState: State = {
  access: null,
  entry: 'Welcome',
  status: 'idle',
  saving: false,
  error: null,
};
type Config = {
  extra: AppDependencies;
  rejectValue: string;
  state: { auth: State };
};
export const hydrateDemoAccess = createAsyncThunk<DemoAccess, void, Config>(
  'auth/hydrate',
  async (_, { extra, rejectWithValue }) => {
    try {
      return await extra.demo.hydrate(
        (await extra.preferences.getDemoAccess?.()) ?? null,
      );
    } catch {
      return rejectWithValue('Demo session could not be loaded. Please retry.');
    }
  },
  { condition: (_, { getState }) => getState().auth.status !== 'loading' },
);
export const setDemoAccess = createAsyncThunk<DemoAccess, DemoAccess, Config>(
  'auth/access',
  async (mode, { extra, rejectWithValue }) => {
    try {
      await extra.demo.setAccess(mode);
      return mode;
    } catch {
      return rejectWithValue('Demo session could not be saved. Please retry.');
    }
  },
  { condition: (_, { getState }) => !getState().auth.saving },
);
export const clearLocalDemo = createAsyncThunk<void, void, Config>(
  'auth/clearLocalDemo',
  async (_, { extra, rejectWithValue }) => {
    try {
      await extra.demo.clearDemoData();
    } catch {
      return rejectWithValue(
        'Demo data could not be fully cleared. Please retry from Settings.',
      );
    }
  },
  { condition: (_, { getState }) => !getState().auth.saving },
);
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    selectAuthEntry(state, action: PayloadAction<State['entry']>) {
      state.entry = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(clearLocalDemo.pending, state => {
        state.saving = true;
        state.error = null;
      })
      .addCase(clearLocalDemo.fulfilled, state => {
        state.saving = false;
        state.access = null;
        state.entry = 'Welcome';
        state.status = 'ready';
        state.error = null;
      })
      .addCase(clearLocalDemo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Unable to clear demo data.';
      })
      .addCase(hydrateDemoAccess.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(hydrateDemoAccess.fulfilled, (state, action) => {
        state.status = 'ready';
        state.access = action.payload;
      })
      .addCase(hydrateDemoAccess.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Demo session unavailable.';
      })
      .addCase(setDemoAccess.pending, state => {
        state.saving = true;
        state.error = null;
      })
      .addCase(setDemoAccess.fulfilled, (state, action) => {
        state.saving = false;
        state.access = action.payload;
      })
      .addCase(setDemoAccess.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Demo session unavailable.';
      }),
});
export const { selectAuthEntry } = slice.actions;
export const authReducer = slice.reducer;
