import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Milestone } from '../types/Index';

interface MilestoneState {
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
}

const initialState: MilestoneState = {
  milestones: [],
  loading: false,
  error: null,
};

/* ================= GET BY PROJECT ================= */
export const fetchMilestonesByProject = createAsyncThunk<Milestone[], number>(
  'milestone/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/MileStone?ProjectId=${projectId}`);
      return Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data
        ? [res.data.data]
        : [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch milestones');
    }
  }
);

/* ================= CREATE ================= */
export const createMilestone = createAsyncThunk<Milestone, Omit<Milestone, 'milestone_id'>>(
  'milestone/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/MileStone', data);
      console.log("data",res )
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create milestone');
    }
  }
);

/* ================= UPDATE ================= */
export const updateMilestone = createAsyncThunk<Milestone, Milestone>(
  'milestone/update',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/MileStone/${data.ProjectMilestoneId}`, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update milestone');
    }
  }
);

/* ================= DELETE ================= */
export const deleteMilestone = createAsyncThunk<number, number>(
  'milestone/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/MileStone/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete milestone');
    }
  }
);

/* ================= SLICE ================= */
const milestoneSlice = createSlice({
  name: 'milestone',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchMilestonesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestonesByProject.fulfilled, (state, action: PayloadAction<Milestone[]>) => {
        state.milestones = action.payload;
        state.loading = false;
      })
      .addCase(fetchMilestonesByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch milestones';
      })

      /* CREATE */
      .addCase(createMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        state.milestones.push(action.payload);
        state.loading = false;
      })
      .addCase(createMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to create milestone';
      })

      /* UPDATE */
      .addCase(updateMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        const index = state.milestones.findIndex((m) => m.ProjectMilestoneId === action.payload.ProjectMilestoneId);
        if (index !== -1) state.milestones[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteMilestone.fulfilled, (state, action: PayloadAction<number>) => {
        state.milestones = state.milestones.filter((m) => m.ProjectMilestoneId !== action.payload);
      });
  },
});

export default milestoneSlice.reducer;
