import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { Milestone } from '../types/Index';
 
interface MilestoneState {
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
  currentProjectId: number | null; // ✅ Track which project's data we have
}
 
const initialState: MilestoneState = {
  milestones: [],
  loading: false,
  error: null,
  currentProjectId: null,
};
 
/* ================= GET ALL ================= */
export const fetchMilestones = createAsyncThunk<Milestone[]>(
  'milestone/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/MileStone');
      console.log('📥 Fetched all milestones - Raw response:', res.data);
     
      let milestones: Milestone[] = [];
     
      if (res.data && res.data.success) {
        const data = res.data.data;
       
        console.log('🔍 Checking milestone data structure:');
        console.log('  → Type:', typeof data);
        console.log('  → Is Array?', Array.isArray(data));
        console.log('  → Has nested "data"?', data && 'data' in data);
       
        // Case 1: Paginated response { data: { data: [...] } }
        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
          console.log('✅ Paginated format - extracting nested array');
          milestones = data.data;
        }
        // Case 2: Direct array { data: [...] }
        else if (Array.isArray(data)) {
          console.log('✅ Direct array format');
          milestones = data;
        }
        // Case 3: Single object { data: {...} }
        else if (data && typeof data === 'object' && 'ProjectMilestoneId' in data) {
          console.log('✅ Single object - converting to array');
          milestones = [data];
        }
        // Case 4: Empty
        else {
          console.log('ℹ️ No data or empty');
          milestones = [];
        }
      } else {
        console.log('⚠️ API returned success: false or no data');
        milestones = [];
      }
     
      console.log(`✅ Returning ${milestones.length} milestones`);
      return milestones;
     
    } catch (err: any) {
      console.error('❌ Error fetching milestones:', err);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch milestones');
    }
  }
);
 
/* ================= GET BY PROJECT ================= */
export const fetchMilestonesByProject = createAsyncThunk<
  { milestones: Milestone[]; projectId: number },
  number
>(
  'milestone/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      console.log(`📥 Fetching milestones for project ${projectId}...`);
     
      // ✅ TRY BOTH ENDPOINTS
      let res = await api.get(`/MileStone`, {
        params: { projectId }
      });
     
      console.log('='.repeat(70));
      console.log('📦 RAW MILESTONE API RESPONSE:');
      console.log('='.repeat(70));
      console.log('Endpoint:', `/MileStone?projectId=${projectId}`);
      console.log('Response data:', res.data);
      console.log('Response data.data:', res.data?.data);
     
      // If query params didn't work, try path parameter
      if (!res.data?.success || !res.data?.data) {
        console.log('⚠️ Query params failed, trying path parameter...');
        res = await api.get(`/MileStone/${projectId}`);
        console.log('Response from path param:', res.data);
      }
     
      // ✅ CRITICAL FIX: Transform API response to match TypeScript interface
      let milestones: Milestone[] = [];
     
      if (res.data && res.data.success) {
        const data = res.data.data;
       
        console.log('🔍 Milestone data structure check:');
        console.log('  → data type:', typeof data);
        console.log('  → data is array?', Array.isArray(data));
        console.log('  → data has "data" property?', data && 'data' in data);
       
        let rawMilestones: any[] = [];
       
        // Case 1: Paginated response with nested data array
        if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
          console.log('✅ Format: Paginated with nested data array');
          rawMilestones = data.data;
        }
        // Case 2: Direct array
        else if (Array.isArray(data)) {
          console.log('✅ Format: Direct array');
          rawMilestones = data;
        }
        // Case 3: Single object
        else if (data && typeof data === 'object' && 'projectMilestoneId' in data) {
          console.log('✅ Format: Single object (converting to array)');
          rawMilestones = [data];
        }
       
        // ✅ Transform field names from API format to TypeScript format
        milestones = rawMilestones.map((m: any) => ({
          ProjectMilestoneId: m.projectMilestoneId,
          ProjectId: m.projectId,
          milestoneName: m.milestoneName,
          description: m.description || '',
          paymentPercentage: m.paymentPercentage,
          milestoneAmount: m.milestoneAmount,
          milestoneStatusId: m.milestoneStatusId,
          dueDate: m.dueDate,
         mileStoneStatusName: m.mileStoneStatusName || 'Pending',
          statusColor: m.statusColor,
          isActive: m.isActive,
        }));
       
        console.log('✅ Transformed milestones:', milestones.length);
      }
     
      console.log('='.repeat(70));
      console.log('✅ PROCESSED MILESTONES:');
      console.log('='.repeat(70));
      console.log('Count:', milestones.length);
      console.log('Milestones:', milestones.map(m => ({
        id: m.ProjectMilestoneId,
        name: m.milestoneName,
        projectId: m.ProjectId,
        amount: m.milestoneAmount
      })));
      console.log('='.repeat(70));
     
      return { milestones, projectId };
    } catch (err: any) {
      console.error(`❌ Error fetching milestones for project ${projectId}:`, err);
      console.error('Error response:', err.response?.data);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch milestones');
    }
  }
);
 
/* ================= CREATE ================= */
export const createMilestone = createAsyncThunk<
  Milestone,
  Omit<Milestone, 'ProjectMilestoneId'>,
  { rejectValue: string }
>(
  'milestone/create',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      console.log('📤 Creating milestone:', data);
      const res = await api.post('/Milestone', data);
      console.log('✅ Create milestone response:', res.data);
      console.log('  → Full response object:', res);
      console.log('  → Response status:', res.status);
     
      let created = res.data.data || res.data;
     
      console.log('📦 Extracted data:', created);
     
      // ✅ CRITICAL FIX: If response is empty or doesn't have ID, use the sent data
      if (!created || !created.ProjectMilestoneId) {
        console.warn('⚠️ Response missing data or ProjectMilestoneId - using sent data with temp ID');
       
        // Generate temporary ID and use sent data
        created = {
          ...data,
          ProjectMilestoneId: Date.now(), // Temporary ID
          status: data.statusColor || 'Pending',
        };
       
        console.log('📦 Using fallback created milestone:', created);
       
        // ✅ IMPORTANT: Refetch from server to get real data
        setTimeout(() => {
          console.log('🔄 Refetching milestones to get server data...');
          if (data.ProjectId) {
            dispatch(fetchMilestonesByProject(data.ProjectId));
          }
        }, 500); // Small delay to let server process
      } else {
        // Ensure all fields are present
        if (!created.ProjectId && data.ProjectId) {
          created.ProjectId = data.ProjectId;
        }
        if (!created.status) {
          created.status = data.statusColor || 'Pending';
        }
      }
     
      console.log('📦 Returning created milestone:', created);
      return created as Milestone;
     
    } catch (err: any) {
      console.error('❌ Error creating milestone:', err);
      console.error('Error response:', err.response?.data);
     
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create milestone';
     
      // ✅ If milestone already exists, refetch
      if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
        console.log('⚠️ Milestone already exists - refetching...');
        if (data.ProjectId) {
          dispatch(fetchMilestonesByProject(data.ProjectId));
        }
      }
     
      return rejectWithValue(errorMsg);
    }
  }
);
 
/* ================= UPDATE ================= */
export const updateMilestone = createAsyncThunk<Milestone, Milestone>(
  'milestone/update',
  async (data, { rejectWithValue }) => {
    try {
    
      const res = await api.put(`/Milestone/${data.ProjectMilestoneId}`, data);
    
     
      const updated = res.data.data || res.data;
      return { ...data, ...updated } as Milestone;
    } catch (err: any) {
      console.error('❌ Error updating milestone:', err);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update milestone');
    }
  }
);
 
/* ================= DELETE ================= */
export const deleteMilestone = createAsyncThunk<number, number>(
  'milestone/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting milestone:', id);
      await api.delete(`/Milestone/${id}`);
      console.log('✅ Milestone deleted:', id);
      return id;
    } catch (err: any) {
      console.error('❌ Error deleting milestone:', err);
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete milestone');
    }
  }
);
 
/* ================= SLICE ================= */
const milestoneSlice = createSlice({
  name: 'milestone',
  initialState,
  reducers: {
    clearMilestones: (state) => {
      state.milestones = [];
      state.error = null;
      state.currentProjectId = null;
      console.log('🧹 Cleared all milestones from state');
    },
    setCurrentProjectId: (state, action: PayloadAction<number | null>) => {
      state.currentProjectId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ==================== FETCH ALL ==================== */
      .addCase(fetchMilestones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestones.fulfilled, (state, action: PayloadAction<Milestone[]>) => {
        state.loading = false;
        state.milestones = action.payload;
        state.currentProjectId = null;
        console.log('✅ Redux state updated with all milestones:', action.payload.length);
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch milestones';
        console.error('❌ Redux fetch all rejected:', state.error);
      })
 
      /* ==================== FETCH BY PROJECT ==================== */
      .addCase(fetchMilestonesByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMilestonesByProject.fulfilled, (state, action) => {
        state.loading = false;
       
        const { milestones, projectId } = action.payload;
       
        // ✅ CRITICAL: Replace entire array
        state.milestones = milestones;
        state.currentProjectId = projectId;
       
        console.log('='.repeat(70));
        console.log('✅ REDUX STATE UPDATED - MILESTONES');
        console.log('='.repeat(70));
        console.log('Project ID:', projectId);
        console.log('Total milestones loaded:', state.milestones.length);
        console.log('Milestones:', state.milestones.map(m => ({
          id: m.ProjectMilestoneId,
          name: m.milestoneName,
          projectId: m.ProjectId,
          amount: m.milestoneAmount
        })));
        console.log('='.repeat(70));
      })
      .addCase(fetchMilestonesByProject.rejected, (state, action) => {
        state.loading = false;
        state.milestones = [];
        state.error = action.payload as string || action.error.message || 'Failed to fetch milestones';
        console.error('❌ Redux fetch by project rejected:', state.error);
      })
 
      /* ==================== CREATE ==================== */
      .addCase(createMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        state.loading = false;
       
        const newMilestone = action.payload;
       
        console.log('='.repeat(70));
        console.log('✅ CREATE MILESTONE FULFILLED');
        console.log('='.repeat(70));
        console.log('New milestone:', newMilestone);
        console.log('Current state milestones before add:', state.milestones.length);
       
        // ✅ Check if milestone belongs to current project
        if (state.currentProjectId === null ||
            Number(newMilestone.ProjectId) === Number(state.currentProjectId)) {
         
          const exists = state.milestones.some(
            m => m.ProjectMilestoneId === newMilestone.ProjectMilestoneId
          );
         
          if (!exists) {
            state.milestones.push(newMilestone);
            console.log('✅ Milestone added to Redux state');
            console.log('📊 Total milestones now:', state.milestones.length);
          } else {
            console.warn('⚠️ Milestone already exists in state, not adding duplicate');
          }
        } else {
          console.log('⚠️ Milestone belongs to different project, not adding to current state');
        }
       
        console.log('Final state milestones:', state.milestones.length);
        console.log('='.repeat(70));
      })
      .addCase(createMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to create milestone';
        console.error('❌ Redux create rejected:', state.error);
      })
 
      /* ==================== UPDATE ==================== */
      .addCase(updateMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action: PayloadAction<Milestone>) => {
        state.loading = false;
       
        const updated = action.payload;
        const index = state.milestones.findIndex(
          (m) => m.ProjectMilestoneId === updated.ProjectMilestoneId
        );
       
        if (index !== -1) {
          state.milestones[index] = updated;
          console.log('✅ Updated milestone in Redux state:', updated);
        } else {
          console.warn('⚠️ Milestone not found for update');
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to update milestone';
        console.error('❌ Redux update rejected:', state.error);
      })
 
      /* ==================== DELETE ==================== */
      .addCase(deleteMilestone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
       
        const deletedId = action.payload;
        const beforeCount = state.milestones.length;
       
        state.milestones = state.milestones.filter(
          (m) => m.ProjectMilestoneId !== deletedId
        );
       
        const afterCount = state.milestones.length;
       
        console.log('='.repeat(70));
        console.log('✅ DELETE MILESTONE FULFILLED');
        console.log('='.repeat(70));
        console.log(`Deleted milestone ID: ${deletedId}`);
        console.log(`Count: ${beforeCount} → ${afterCount}`);
        console.log(`Successfully removed: ${beforeCount > afterCount}`);
        console.log('='.repeat(70));
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to delete milestone';
        console.error('❌ Redux delete rejected:', state.error);
      });
  },
});
 
export const { clearMilestones, setCurrentProjectId } = milestoneSlice.actions;
export default milestoneSlice.reducer