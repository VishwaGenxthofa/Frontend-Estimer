// src/features/estimation/slice/estimationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/projectapi';

// ================= TYPES =================
export interface taxConfigsname {
  taxConfigId: number;
  taxName: string;
  taxRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  id: string; // backend primary key
}
export interface TaxConfig {
     taxconfig: taxConfigsname[];
      loading: boolean;
      error: string | null;
}
const initialState: TaxConfig = {
  // ... your existing initial values
  taxconfig:[],
  loading: false,
  error: null,
};
// ================= FETCH TAX CONFIGS THUNK =================
export const fetchTaxConfigs = createAsyncThunk<
  taxConfigsname[],
  void,
  { rejectValue: string }
>('estimation/fetchTaxConfigs', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/taxConfigs');
    console.log('Fetched tax configs:', response.data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load tax configurations');
  }
});
// ================= SLICE =================
const estimationTaxconfig = createSlice({
  name: 'estimation',
  initialState,
  reducers: {
    // ... your existing reducers
  },
  extraReducers: (builder) => {
   builder
    // === TAX CONFIGS ===
    .addCase(fetchTaxConfigs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTaxConfigs.fulfilled, (state, action) => {
      state.loading = false;
      // Store only active tax configs
      state.taxconfig = action.payload.filter((tax: taxConfigsname) => tax.isActive);
    })
    .addCase(fetchTaxConfigs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Error loading tax configs';
    });
}
});

export default estimationTaxconfig.reducer;