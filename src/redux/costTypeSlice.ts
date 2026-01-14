import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ---------- TYPES ---------- */
export interface CostType {
  costTypeId: number;
  costTypeName: string;
  description: string;
  category: "directCosts" | "indirectCosts" | "additionalCosts";
  isActive: boolean;
  requiresQuantity: boolean;
  requiresRate: boolean;
  requiresMonths: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface CostTypeState {
  costTypes: CostType[];
  loading: boolean;
  error: string | null;
}

/* ---------- INITIAL STATE ---------- */
const initialState: CostTypeState = {
  costTypes: [],
  loading: false,
  error: null,
};

/* ---------- API CALL ---------- */
export const fetchCostTypes = createAsyncThunk(
  "costTypes/fetchCostTypes",
  async () => {
    const res = await axios.get("http://localhost:3000/costTypes"); 
    // change URL if needed
    return res.data as CostType[];
  }
);

/* ---------- SLICE ---------- */
const costTypeSlice = createSlice({
  name: "costTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
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
        state.error = action.error.message || "Failed to load cost types";
      });
  },
});

export default costTypeSlice.reducer;
