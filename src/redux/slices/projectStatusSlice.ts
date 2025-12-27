import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { ProjectStatus } from '../../types/Index';
import { saveStatusesToStorage, getStatusesFromStorage } from '../../utils/projectstatusStorage';
interface ProjectStatusState {
  statuses: ProjectStatus[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectStatusState = {
  statuses: [],
  loading: false,
  error: null,
};

/* ================= GET PROJECT STATUS ================= */

export const fetchProjectStatuses = createAsyncThunk(
  'projectStatus/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/ProjectStatus');

      // ✅ CORRECT PATH
      return res.data?.data?.data ?? [];
      
    } catch (err: any) {
      return rejectWithValue('Failed to load status');
    }
  }
);

/* ================= CREATE PROJECT STATUS ================= */

export const createProjectStatus = createAsyncThunk(
  'projectStatus/create',
  async (
    payload: Omit<ProjectStatus, 'projectStatusId'>,
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/ProjectStatus', payload);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Create failed'
      );
    }
  }
);

/* ================= DELETE PROJECT STATUS ================= */

export const deleteProjectStatus = createAsyncThunk(
  'projectStatus/delete',
  async (projectStatusId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/ProjectStatus/${projectStatusId}`);
      return projectStatusId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Delete failed'
      );
    }
  }
);

/* ================= SLICE ================= */

const projectStatusSlice = createSlice({
  name: 'projectStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ===== FETCH ===== */
      .addCase(fetchProjectStatuses.pending, (state) => {
        state.loading = true;
      })
    .addCase(fetchProjectStatuses.fulfilled, (state, action) => {
  console.log('API STATUS DATA:', action.payload);
  state.statuses = action.payload;
})

      .addCase(fetchProjectStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ===== CREATE ===== */
      .addCase(createProjectStatus.fulfilled, (state, action) => {
        state.statuses.push(action.payload);
      })

      /* ===== DELETE ===== */
      .addCase(deleteProjectStatus.fulfilled, (state, action) => {
        state.statuses = state.statuses.filter(
          (s) => s.projectStatusId !== action.payload
        );
      });
  },
});

export default projectStatusSlice.reducer;
