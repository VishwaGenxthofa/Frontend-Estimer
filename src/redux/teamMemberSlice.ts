import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { TeamMember } from '../types/Index';
 
interface TeamMemberState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  currentProjectId: number | null;
}
 
const initialState: TeamMemberState = {
  members: [],
  loading: false,
  error: null,
  currentProjectId: null,
};
 
/* ================= GET ALL ================= */
export const fetchTeamMembers = createAsyncThunk<TeamMember[]>(
  'teamMember/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/ProjectTeam');
      console.log('📥 Fetched all team members - Raw response:', res.data);
     
      let teamMembers: TeamMember[] = [];
     
      if (res.data && res.data.success) {
        const data = res.data.data;
       
        console.log('🔍 Checking data structure:');
        console.log('  → Type:', typeof data);
        console.log('  → Is Array?', Array.isArray(data));
        console.log('  → Has nested "data"?', data && 'data' in data);
       
        // Case 1: Paginated response { data: { data: [...] } }
        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
          console.log('✅ Paginated format - extracting nested array');
          teamMembers = data.data;
        }
        // Case 2: Direct array { data: [...] }
        else if (Array.isArray(data)) {
          console.log('✅ Direct array format');
          teamMembers = data;
        }
        // Case 3: Single object { data: {...} }
        else if (data && typeof data === 'object' && 'projectTeamMemberId' in data) {
          console.log('✅ Single object - converting to array');
          teamMembers = [data];
        }
        // Case 4: Empty
        else {
          console.log('ℹ️ No data or empty');
          teamMembers = [];
        }
      } else {
        console.log('⚠️ API returned success: false or no data');
        teamMembers = [];
      }
     
      console.log(`✅ Returning ${teamMembers.length} team members`);
      return teamMembers;
     
    } catch (err: any) {
      console.error('❌ Error fetching team members:', err);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch team members');
    }
  }
);
 
/* ================= GET BY PROJECT - FIXED ================= */
export const fetchTeamMembersByProject = createAsyncThunk<
  { members: TeamMember[]; projectId: number },
  number
>(
  'teamMember/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      console.log(`📥 Fetching team members for project ${projectId}...`);
      // Try this endpoint instead
      const res = await api.get(`/ProjectTeam?projectId=${projectId}`);
     
      console.log('='.repeat(70));
      console.log('📦 RAW API RESPONSE:');
      console.log('='.repeat(70));
      console.log('Full response:', res);
      console.log('Response data:', res.data);
      console.log('Response data.data:', res.data?.data);
      console.log('Response status:', res.status);
      console.log('Response success:', res.data?.success);
     
      // ✅ CRITICAL DEBUG: Log exact structure
      if (res.data?.data) {
        console.log('🔍 Detailed data.data inspection:');
        console.log('  Type:', typeof res.data.data);
        console.log('  Is Array?', Array.isArray(res.data.data));
        console.log('  Has "data" property?', res.data.data && 'data' in res.data.data);
        console.log('  Content:', JSON.stringify(res.data.data, null, 2));
      }
      console.log('='.repeat(70));
     
      // ✅ CRITICAL FIX: Handle BOTH API response formats
      let teamMembers: TeamMember[] = [];
     
      if (res.data && res.data.success) {
        const data = res.data.data;
       
        console.log('🔍 API data structure check:');
        console.log('  → data type:', typeof data);
        console.log('  → data is array?', Array.isArray(data));
        console.log('  → data has "data" property?', data && 'data' in data);
        console.log('  → data content:', data);
       
        // Case 1: Paginated response with nested data array
        // { data: { pageNumber: 1, data: [...] } }
        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
          console.log('✅ Format: Paginated with nested data array');
          teamMembers = data.data;
        }
        // Case 2: Direct array
        // { data: [...] }
        else if (Array.isArray(data)) {
          console.log('✅ Format: Direct array');
          teamMembers = data;
        }
        // Case 3: Single object (convert to array)
        // { data: { projectTeamMemberId: 1, ... } }
        else if (data && typeof data === 'object' && 'projectTeamMemberId' in data) {
          console.log('✅ Format: Single object (converting to array)');
          teamMembers = [data];
        }
        // Case 4: Empty/null (no members)
        else if (data === null || data === undefined) {
          console.log('ℹ️ No data - empty array');
          teamMembers = [];
        }
        // Case 5: Unknown format - log warning
        else {
          console.warn('⚠️ Unknown data format:', data);
          teamMembers = [];
        }
      }
      // API returned success: false
      else if (res.data && res.data.success === false) {
        console.log('ℹ️ API returned success: false - empty array');
        teamMembers = [];
      }
     
      console.log('='.repeat(70));
      console.log('✅ PROCESSED TEAM MEMBERS:');
      console.log('='.repeat(70));
      console.log('Count:', teamMembers.length);
      console.log('Members:', teamMembers.map(m => ({
        id: m.projectTeamMemberId,
        employeeId: m.employeeId,
        name: m.employeeName,
        projectId: m.projectId
      })));
      console.log('='.repeat(70));
     
      return { members: teamMembers, projectId };
    } catch (err: any) {
      console.error(`❌ Error fetching team members for project ${projectId}:`, err);
      console.error('Error response:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch team members');
    }
  }
);
 
/* ================= CREATE - WITH BETTER ERROR HANDLING ================= */
export const createTeamMember = createAsyncThunk<
  TeamMember,
  Omit<TeamMember, 'projectTeamMemberId'>,
  { rejectValue: string }
>(
  'teamMember/create',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      console.log('📤 Creating team member:', data);
      const res = await api.post('/ProjectTeam', data);
      console.log('✅ Create response:', res.data);
     
      // Extract created member
      let created = res.data.data || res.data;
     
      // Ensure required fields
      if (!created.projectTeamMemberId) {
        console.warn('⚠️ Response missing projectTeamMemberId');
        created = {
          ...data,
          projectTeamMemberId: Date.now(),
        };
      }
     
      if (!created.projectId && data.projectId) {
        created.projectId = data.projectId;
      }
     
      console.log('📦 Returning created member:', created);
      return created as TeamMember;
     
    } catch (err: any) {
      console.error('❌ Error creating team member:', err);
      console.error('Error response:', err.response?.data);
     
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create team member';
     
      // ✅ CRITICAL: If employee already assigned, refetch to get latest data
      if (errorMsg.includes('already assigned') || errorMsg.includes('already exists')) {
        console.log('⚠️ Employee already assigned - refetching team members...');
        if (data.projectId) {
          dispatch(fetchTeamMembersByProject(data.projectId));
        }
      }
     
      return rejectWithValue(errorMsg);
    }
  }
);
 
/* ================= UPDATE ================= */
export const updateTeamMember = createAsyncThunk<TeamMember, TeamMember>(
  'teamMember/update',
  async (data, { rejectWithValue }) => {
    try {
      console.log('📤 Updating team member:', data);
      const res = await api.put(`/ProjectTeam/${data.projectTeamMemberId}`, data);
      console.log('✅ Team member updated:', res.data);
     
      const updated = res.data.data || res.data;
      return { ...data, ...updated } as TeamMember;
    } catch (err: any) {
      console.error('❌ Error updating team member:', err);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update team member');
    }
  }
);
 
/* ================= DELETE ================= */
export const deleteTeamMember = createAsyncThunk<number, number>(
  'teamMember/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting team member:', id);
      await api.delete(`/ProjectTeam/${id}`);
      console.log('✅ Team member deleted:', id);
      return id;
    } catch (err: any) {
      console.error('❌ Error deleting team member:', err);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete team member');
    }
  }
);
 
/* ================= SLICE ================= */
const teamMemberSlice = createSlice({
  name: 'teamMember',
  initialState,
  reducers: {
    clearTeamMembers: (state) => {
      state.members = [];
      state.error = null;
      state.currentProjectId = null;
      console.log('🧹 Cleared all team members from state');
    },
    setCurrentProjectId: (state, action: PayloadAction<number | null>) => {
      state.currentProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ==================== FETCH ALL ==================== */
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action: PayloadAction<TeamMember[]>) => {
        state.loading = false;
        state.members = action.payload;
        state.currentProjectId = null;
        console.log('✅ Redux state updated with all members:', action.payload.length);
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch team members';
        console.error('❌ Redux fetch all rejected:', state.error);
      })
 
      /* ==================== FETCH BY PROJECT ==================== */
      .addCase(fetchTeamMembersByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembersByProject.fulfilled, (state, action) => {
        state.loading = false;
       
        const { members, projectId } = action.payload;
       
        // ✅ CRITICAL: Replace entire array
        state.members = members;
        state.currentProjectId = projectId;
       
        console.log('='.repeat(70));
        console.log('✅ REDUX STATE UPDATED - FETCH BY PROJECT');
        console.log('='.repeat(70));
        console.log('Project ID:', projectId);
        console.log('Total members loaded:', state.members.length);
        console.log('Members:', state.members.map(m => ({
          id: m.projectTeamMemberId,
          employeeId: m.employeeId,
          name: m.employeeName,
          projectId: m.projectId,
        })));
        console.log('='.repeat(70));
      })
      .addCase(fetchTeamMembersByProject.rejected, (state, action) => {
        state.loading = false;
        state.members = [];
        state.error = action.payload as string || action.error.message || 'Failed to fetch team members';
        console.error('❌ Redux fetch by project rejected:', state.error);
      })
 
      /* ==================== CREATE ==================== */
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.loading = false;
       
        const newMember = action.payload;
       
        console.log('='.repeat(70));
        console.log('✅ CREATE FULFILLED');
        console.log('='.repeat(70));
        console.log('New member:', newMember);
       
        // Check if member belongs to current project
        if (state.currentProjectId === null ||
            Number(newMember.projectId) === Number(state.currentProjectId)) {
         
          // Check if already exists
          const exists = state.members.some(
            m => m.projectTeamMemberId === newMember.projectTeamMemberId
          );
         
          if (!exists) {
            state.members.push(newMember);
            console.log('✅ Member added to Redux. Total:', state.members.length);
          } else {
            console.warn('⚠️ Member already exists, not adding duplicate');
          }
        }
       
        console.log('='.repeat(70));
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to create team member';
        console.error('❌ Redux create rejected:', state.error);
      })
 
      /* ==================== UPDATE ==================== */
      .addCase(updateTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMember.fulfilled, (state, action: PayloadAction<TeamMember>) => {
        state.loading = false;
       
        const updated = action.payload;
        const index = state.members.findIndex(
          (m) => m.projectTeamMemberId === updated.projectTeamMemberId
        );
       
        if (index !== -1) {
          state.members[index] = updated;
          console.log('✅ Updated member in Redux state');
        } else {
          console.warn('⚠️ Member not found for update');
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to update team member';
        console.error('❌ Redux update rejected:', state.error);
      })
 
      /* ==================== DELETE ==================== */
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
       
        const deletedId = action.payload;
        const beforeCount = state.members.length;
       
        state.members = state.members.filter(
          (m) => m.projectTeamMemberId !== deletedId
        );
       
        const afterCount = state.members.length;
       
        console.log('='.repeat(70));
        console.log('✅ DELETE FULFILLED');
        console.log('='.repeat(70));
        console.log(`Deleted ID: ${deletedId}`);
        console.log(`Count: ${beforeCount} → ${afterCount}`);
        console.log('='.repeat(70));
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to delete team member';
        console.error('❌ Redux delete rejected:', state.error);
      });
  },
});
 
export const { clearTeamMembers, setCurrentProjectId } = teamMemberSlice.actions;
export default teamMemberSlice.reducer;