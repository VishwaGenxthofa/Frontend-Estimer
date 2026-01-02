import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type{ Employee } from '../types/Index';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const res = await fetch('http://localhost:3000/employees');
    return (await res.json()) as Employee[];
  }
);

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
}

const initialState: EmployeesState = {
  employees: [],
  loading: false,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployees.pending, state => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.loading = false;
      });
  },
});

export default employeesSlice.reducer;
