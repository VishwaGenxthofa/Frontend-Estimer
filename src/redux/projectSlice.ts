// redux/slices/projectSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Project } from '../types/Index';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

/* ================= GET ALL PROJECTS ================= */
export const fetchProjects = createAsyncThunk<
  Project[],
  { page?: number; pageSize?: number },
  { rejectValue: string }
>(
  'project/fetchProjects',
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Project?page=${page}&pageSize=${pageSize}`);

      const projects = response.data?.result?.data ?? [];
      console.table(projects);

      return projects.map((p: any): Project => ({
        projectId: p.projectId,
        projectName: p.projectName ?? '',
        clientId: p.clientId,
        projectManagerId: p.projectManagerId,
        projectStatusId: p.projectStatusId,
        companyName: p.companyName,
        projectStatus: p.projectStatus,
        startDate: p.startDate,
        plannedEndDate: p.plannedEndDate,
        paymentTerms: p.paymentTerms ?? 0,
        finalBillingAmount: Number(p.finalBillingAmount) || 0,
        statusColor: p.statusColor,
        projectManager: p.projectManager,
      }));
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

/* ================= CREATE PROJECT ================= */
export const createProject = createAsyncThunk(
  'project/create',
  async (payload: Project, { rejectWithValue }) => {
    try {
      const res = await api.post('/Project', payload);
        console.log("project details ",res.data)
      return res.data;
     
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Create project failed');
    }
  }
);

/* ================= SLICE ================= */
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
         console.log('API project DATA:', action.payload);
         state.projects = action.payload.sort(
    (a, b) => a.projectId - b.projectId)
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
