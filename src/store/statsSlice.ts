import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stats } from '@/domain/stats.model';

interface StatsState {
  data: Stats | null;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
}

const initialState: StatsState = {
  data: null,
  isLoading: false,
  error: null,
  userId: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStatsLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    setStats(state, action: PayloadAction<{ data: Stats; userId: string }>) {
      state.data = action.payload.data;
      state.isLoading = false;
      state.userId = action.payload.userId;
    },
    setStatsError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearStats(state) {
      state.data = null;
      state.isLoading = false;
      state.error = null;
      state.userId = null;
    },
  },
});

export const { setStatsLoading, setStats, setStatsError, clearStats } =
  statsSlice.actions;
export default statsSlice.reducer;
