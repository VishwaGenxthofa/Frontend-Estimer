// src/features/estimation/slice/estimationSlice.ts
import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import axios from '../api/projectapi'; // or your custom api instance
import type { Estimate } from '../types/Index';

// ================= STATE =================
interface EstimationState {
  estimates: Estimate[];
  laborCosts: any[];     // You can type these better later
  directCosts: any[];
  indirectCosts: any[];
  additionalCosts: any[];
  employees: any[];
  costTypes: any[];
  taxConfigs: any[];
  statuses: any[];
  selectedEstimate: Estimate | null;
  showDetailModal: boolean;
  showCreateModal: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: EstimationState = {
  estimates: [],
  laborCosts: [],
  directCosts: [],
  indirectCosts: [],
  additionalCosts: [],
  employees: [],
  costTypes: [],
  taxConfigs: [],
  statuses: [],
  selectedEstimate: null,
  showDetailModal: false,
  showCreateModal: false,
  loading: false,
  error: null,
};

// ================= ASYNC THUNKS =================

// GET: Fetch all estimates
export const fetchEstimates = createAsyncThunk('estimation/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/estimates'); // Adjust URL
    return response.data; // Your full JSON array
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch estimates');
  }
});

// POST: Create new estimate
export const createEstimate = createAsyncThunk(
  'estimation/create',
  async (newEstimate: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/estimates', newEstimate);
      return response.data; // Should return the created estimate with id
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create estimate');
    }
  }
);

// PUT/PATCH: Update estimate
export const updateEstimate = createAsyncThunk(
  'estimation/update',
  async ({ id, data }: { id: string; data: Partial<any> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/estimates/${id}`, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update estimate');
    }
  }
);

// DELETE: Delete estimate
export const deleteEstimate = createAsyncThunk(
  'estimation/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/estimates/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete estimate');
    }
  }
);

// ================= SLICE =================
const estimationSlice = createSlice({
  name: 'estimation',
  initialState,
  reducers: {
    setSelectedEstimate(state, action: PayloadAction<Estimate | null>) {
      state.selectedEstimate = action.payload;
    },
    toggleDetailModal(state, action: PayloadAction<boolean>) {
      state.showDetailModal = action.payload;
    },
    toggleCreateModal(state, action: PayloadAction<boolean>) {
      state.showCreateModal = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === FETCH ===
      .addCase(fetchEstimates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstimates.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // Flatten all nested arrays into state
        state.estimates = data.map((est: any) => ({
          estimateId: est.id,
          projectId: est.projectId,
          versionNumber: est.versionNumber,
          estimationStatusId: est.statusId,
          profitPercentage: est.profitPercentage,
          taxId: est.taxConfigId,
          clientRemarks: est.clientRemarks,
          // You can calculate totals here or on demand
        }));

        // Collect all nested costs globally (for filtering later)
        data.forEach((est: any) => {
          state.laborCosts.push(...(est.laborCosts || []).map((l: any) => ({ ...l, estimationId: est.id })));
          state.directCosts.push(...(est.directCosts || []).map((d: any) => ({ ...d, estimationId: est.id })));
          state.indirectCosts.push(...(est.indirectCosts || []).map((i: any) => ({ ...i, estimationId: est.id })));
          state.additionalCosts.push(...(est.additionalCosts || []).map((a: any) => ({ ...a, estimationId: est.id })));
        });
      })
      .addCase(fetchEstimates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // === CREATE ===
      .addCase(createEstimate.fulfilled, (state, action) => {
        const newEst = action.payload;
        state.estimates.push({
          estimateId: newEst.id,
          projectId: newEst.projectId,
          versionNumber: newEst.versionNumber,
          estimationStatusId: newEst.statusId,
          profitPercentage: newEst.profitPercentage,
          taxId: newEst.taxConfigId,
          clientRemarks: newEst.clientRemarks,
        });

        // Add nested costs
        state.laborCosts.push(...(newEst.laborCosts || []).map((l: any) => ({ ...l, estimationId: newEst.id })));
        state.directCosts.push(...(newEst.directCosts || []).map((d: any) => ({ ...d, estimationId: newEst.id })));
        state.indirectCosts.push(...(newEst.indirectCosts || []).map((i: any) => ({ ...i, estimationId: newEst.id })));
        state.additionalCosts.push(...(newEst.additionalCosts || []).map((a: any) => ({ ...a, estimationId: newEst.id })));
      })

      // === UPDATE ===
      .addCase(updateEstimate.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.estimates.findIndex(e => e.estimateId === updated.id);
        if (index !== -1) {
          state.estimates[index] = {
            ...state.estimates[index],
            ...updated,
            estimateId: updated.id,
          };
        }
        // Optionally update nested costs too
      })

      // === DELETE ===
      .addCase(deleteEstimate.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.estimates = state.estimates.filter(e => e.estimateId !== deletedId);
        // Clean up nested costs
        const filterByEstId = (arr: any[]) => arr.filter(item => item.estimationId !== deletedId);
        state.laborCosts = filterByEstId(state.laborCosts);
        state.directCosts = filterByEstId(state.directCosts);
        state.indirectCosts = filterByEstId(state.indirectCosts);
        state.additionalCosts = filterByEstId(state.additionalCosts);
      });
  },
});

export const {
  setSelectedEstimate,
  toggleDetailModal,
  toggleCreateModal,
  clearError,
} = estimationSlice.actions;

export default estimationSlice.reducer;