// src/features/estimation/slice/estimationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/projectapi';

// ================= TYPES =================
export interface EstimationStatues {
  estimationStatusId: number;
  statusName: string;
  statusColor: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  id: string; // backend ID
}

interface EstimationState {
  // ... your existing fields
  statuses: EstimationStatues[];
  loading: boolean;
  error: string | null;
}

const initialState: EstimationState = {
  // ... your existing initial values
  statuses: [],
  loading: false,
  error: null,
};

// ================= FETCH STATUSES =================
export const fetchEstimationStatuses = createAsyncThunk<
  EstimationStatues[],
  void,
  { rejectValue: string }
>('estimation/fetchStatuses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/estimationStatuses');
    console.log('Fetched statuses:', response.data);
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to fetch estimation statuses';
    return rejectWithValue(message);
  }
});

// ================= SLICE =================
const estimationStatus = createSlice({
  name: 'estimation',
  initialState,
  reducers: {
    // ... your existing reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstimationStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstimationStatuses.fulfilled, (state, action) => {
        state.loading = false;
        // Only store active ones or all — your choice
        state.statuses = action.payload.filter((s: EstimationStatues) => s.isActive);
        // Or keep all: state.statuses = action.payload;
      })
      .addCase(fetchEstimationStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load statuses';
      });
  },
});

export default estimationStatus.reducer;