// src/features/taxConfigs/taxConfigsSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/projectapi'; // Adjust path if needed (e.g., '../../api/projectapi')

// ================= TYPES =================
export interface TaxConfig {
  taxConfigId: number;
  taxName: string;
  taxRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  id?: string; // Optional backend primary key (e.g., UUID or _id)
}

interface TaxConfigsState {
  taxConfigs: TaxConfig[];
  loading: boolean;
  error: string | null;
}

const initialState: TaxConfigsState = {
  taxConfigs: [],
  loading: false,
  error: null,
};

// ================= ASYNC THUNKS =================

// Fetch all tax configurations
export const fetchTaxConfigs = createAsyncThunk<
  TaxConfig[],
  void,
  { rejectValue: string }
>('taxConfigs/fetchTaxConfigs', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<TaxConfig[]>('/taxConfigs');
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Failed to load tax configurations';
    return rejectWithValue(message);
  }
});

// Add new tax config
export const addTaxConfig = createAsyncThunk<
  TaxConfig,
  Omit<TaxConfig, 'taxConfigId' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('taxConfigs/addTaxConfig', async (newTaxConfig, { rejectWithValue }) => {
  try {
    const response = await api.post<TaxConfig>('/taxConfigs', newTaxConfig);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add tax config');
  }
});

// Update existing tax config
export const updateTaxConfig = createAsyncThunk<
  TaxConfig,
  TaxConfig,
  { rejectValue: string }
>('taxConfigs/updateTaxConfig', async (taxConfig, { rejectWithValue }) => {
  try {
    const response = await api.put<TaxConfig>(
      `/taxConfigs/${taxConfig.taxConfigId}`,
      taxConfig
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update tax config');
  }
});

// Delete tax config
export const deleteTaxConfig = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('taxConfigs/deleteTaxConfig', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/taxConfigs/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete tax config');
  }
});

// ================= SLICE =================
const taxConfigsSlice = createSlice({
  name: 'taxConfigs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchTaxConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.taxConfigs = action.payload; // Store all (you can filter active ones in selectors if needed)
      })
      .addCase(fetchTaxConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load tax configurations';
      });

    // Add
    builder.addCase(addTaxConfig.fulfilled, (state, action) => {
      state.taxConfigs.push(action.payload);
    });

    // Update
    builder.addCase(updateTaxConfig.fulfilled, (state, action) => {
      const index = state.taxConfigs.findIndex(
        (t) => t.taxConfigId === action.payload.taxConfigId
      );
      if (index !== -1) {
        state.taxConfigs[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteTaxConfig.fulfilled, (state, action) => {
      state.taxConfigs = state.taxConfigs.filter(
        (t) => t.taxConfigId !== action.payload
      );
    });

    // Optional error handling for add/update/delete
    builder
      .addCase(addTaxConfig.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add tax config';
      })
      .addCase(updateTaxConfig.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update tax config';
      })
      .addCase(deleteTaxConfig.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete tax config';
      });
  },
});

export default taxConfigsSlice.reducer;