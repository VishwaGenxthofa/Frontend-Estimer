import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
export const fetchTeamMembers = createAsyncThunk(
  'teamMember/fetchAll',
  async () => {
    const res = await api.get('/ProjectTeam');
    return res.data.data as TeamMember[];
  }
);

/* ================= GET BY PROJECT ================= */
export const fetchTeamMembersByProject = createAsyncThunk(
  'teamMember/fetchByProject',
  async (projectId: number) => {
    const res = await api.get(`/ProjectTeam/${projectId}`);
    return res.data.data as TeamMember[];
  }
);

/* ================= CREATE ================= */
export const createTeamMember = createAsyncThunk(
  'teamMember/create',
  async (data: Omit<TeamMember, 'projectTeamMemberId'>) => {
    const res = await api.post('/ProjectTeam', data);
    return res.data.data as TeamMember;
  }
);

/* ================= UPDATE ================= */
export const updateTeamMember = createAsyncThunk(
  'teamMember/update',
  async (data: TeamMember) => {
    const res = await api.put(
      `/ProjectTeam/${data.projectTeamMemberId}`,
      data
    );
    return res.data.data as TeamMember;
  }
);
/* ===================== DELETE ===================== */
export const deleteTeamMember = createAsyncThunk<
  number,
  number
>('teamMember/delete', async (id) => {
  await api.delete(`/ProjectTeam/${id}`);
  return id; // return deleted id
});
/* ================= SLICE ================= */
const teamMemberSlice = createSlice({
  name: 'teamMember',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* GET */
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team members';
      })

      /* CREATE */
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })

      /* UPDATE */
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (m) => m.projectTeamMemberId === action.payload.projectTeamMemberId
        );
        if (index !== -1) state.members[index] = action.payload;
      })
      
      /* DELETE */
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.members = state.members.filter(
          (m) => m.projectTeamMemberId !== action.payload
        );
      });
  },
});

export default teamMemberSlice.reducer;
