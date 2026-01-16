// src/features/costTypes/costTypesSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/projectapi'; // Adjust path based on your structure
// Example: if api is in src/lib/api.ts → '../../lib/api'

// ---------- TYPES ----------
export interface CostType {
  costTypeId: number;
  costTypeName: string;
  description: string;
  category: 'directCosts' | 'indirectCosts' | 'additionalCosts';
  isActive: boolean;
  requiresQuantity: boolean;
  requiresRate: boolean;
  requiresMonths: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  id?: string; // Optional if backend uses string ID (e.g., UUID)
}

interface CostTypesState {
  costTypes: CostType[];
  loading: boolean;
  error: string | null;
}

const initialState: CostTypesState = {
  costTypes: [],
  loading: false,
  error: null,
};

// ---------- ASYNC THUNKS ----------

// Fetch all cost types
export const fetchCostTypes = createAsyncThunk<
  CostType[],
  void,
  { rejectValue: string }
>('costTypes/fetchCostTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<CostType[]>('/costTypes');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch cost types';
    return rejectWithValue(message);
  }
});

// Add new cost type
export const addCostType = createAsyncThunk<
  CostType,
  Omit<CostType, 'costTypeId' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('costTypes/addCostType', async (newCostType, { rejectWithValue }) => {
  try {
    const response = await api.post<CostType>('/costTypes', newCostType);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to add cost type';
    return rejectWithValue(message);
  }
});

// Update cost type
export const updateCostType = createAsyncThunk<
  CostType,
  CostType,
  { rejectValue: string }
>('costTypes/updateCostType', async (costType, { rejectWithValue }) => {
  try {
    const response = await api.put<CostType>(`/costTypes`, costType);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to update cost type';
    return rejectWithValue(message);
  }
});

// Delete cost type
export const deleteCostType = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('costTypes/deleteCostType', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/costTypes`);
    return id;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to delete cost type';
    return rejectWithValue(message);
  }
});

// ---------- SLICE ----------
const costTypesSlice = createSlice({
  name: 'costTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchCostTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCostTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.costTypes = action.payload;
      })
      .addCase(fetchCostTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load cost types';
      });

    // Add
    builder.addCase(addCostType.fulfilled, (state, action) => {
      state.costTypes.push(action.payload);
    });

    // Update
    builder.addCase(updateCostType.fulfilled, (state, action) => {
      const index = state.costTypes.findIndex((ct) => ct.costTypeId === action.payload.costTypeId);
      if (index !== -1) {
        state.costTypes[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteCostType.fulfilled, (state, action) => {
      state.costTypes = state.costTypes.filter((ct) => ct.costTypeId !== action.payload);
    });

    // Optional: Handle errors for add/update/delete
    builder
      .addCase(addCostType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add cost type';
      })
      .addCase(updateCostType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update cost type';
      })
      .addCase(deleteCostType.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete cost type';
      });
  },
});

export default costTypesSlice.reducer;