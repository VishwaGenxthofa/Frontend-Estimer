import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { TeamMember } from '../types/Index';

interface TeamMemberState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamMemberState = {
  members: [],
  loading: false,
  error: null,
};

/* ================= GET ALL ================= */
export const fetchTeamMembers = createAsyncThunk<TeamMember[]>(
  'teamMember/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/ProjectTeam');
      return Array.isArray(res.data.data) ? res.data.data : res.data.data ? [res.data.data] : [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch team members');
    }
  }
);

/* ================= GET BY PROJECT ================= */
export const fetchTeamMembersByProject = createAsyncThunk<TeamMember[], number>(
  'teamMember/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/ProjectTeam/${projectId}`);
      return Array.isArray(res.data.data)
        ? res.data.data
        : res.data.data
        ? [res.data.data]
        : [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch team members');
    }
  }
);

/* ================= CREATE ================= */
export const createTeamMember = createAsyncThunk<TeamMember, Omit<TeamMember, 'projectTeamMemberId'>>(
  'teamMember/create',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/ProjectTeam', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create team member');
    }
  }
);

/* ================= UPDATE ================= */
export const updateTeamMember = createAsyncThunk<TeamMember, TeamMember>(
  'teamMember/update',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/ProjectTeam/${data.projectTeamMemberId}`, data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update team member');
    }
  }
);

/* ================= DELETE ================= */
export const deleteTeamMember = createAsyncThunk<number, number>(
  'teamMember/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/ProjectTeam/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete team member');
    }
  }
);

/* ================= SLICE ================= */
const teamMemberSlice = createSlice({
  name: 'teamMember',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH BY PROJECT */
      .addCase(fetchTeamMembersByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembersByProject.fulfilled, (state, action: PayloadAction<TeamMember[]>) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamMembersByProject.rejected, (state, action) => {
        state.members = [];
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch team members';
      })

      /* FETCH ALL */
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action: PayloadAction<TeamMember[]>) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.members = [];
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch team members';
      })

      /* CREATE */
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.members.push(action.payload);
        state.loading = false;
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to create team member';
      })

      /* UPDATE */
      .addCase(updateTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        const index = state.members.findIndex(
          (m) => m.projectTeamMemberId === action.payload.projectTeamMemberId
        );
        if (index !== -1) state.members[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteTeamMember.fulfilled, (state, action: PayloadAction<number>) => {
        state.members = state.members.filter(
          (m) => m.projectTeamMemberId !== action.payload
        );
      });
  },
});

export default teamMemberSlice.reducer;
