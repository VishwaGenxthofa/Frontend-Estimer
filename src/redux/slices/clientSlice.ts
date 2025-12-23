import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Client } from '../../types/Index';
import {
  saveClientsToStorage,
  getClientsFromStorage,
  clearClientsStorage,
} from '../../utils/clientStorage';

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clients: getClientsFromStorage(),
  loading: false,
  error: null,
};

// ===================== FETCH CLIENTS =====================
export const fetchClients = createAsyncThunk<
  Client[],
  { page?: number; pageSize?: number },
  { rejectValue: string }
>('clients/fetchClients', async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/Client?page=${page}&pageSize=${pageSize}`);
    const clients = response.data?.data?.data ?? [];
    return clients.map((c: any): Client => ({
      clientId: c.clientId,
      clientName: c.clientName ?? '',
      email: c.email ?? '',
      phone: c.phone ?? '',
      address: c.address ?? '',
      isActive: Boolean(c.isActive),
    }));
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch clients');
  }
});

// ===================== CREATE CLIENT =====================
export const createClient = createAsyncThunk<
  void,
  Omit<Client, 'clientId'>,
  { rejectValue: string }
>('clients/createClient', async (client, { rejectWithValue, dispatch }) => {
  try {
    await api.post('/Client', client);
    dispatch(fetchClients({}));
  } catch (err: any) {
    // handle backend validation messages
    const message = err.response?.data?.message || err.message || 'Failed to create client';
    return rejectWithValue(message);
  }
});

// ===================== UPDATE CLIENT =====================
export const updateClient = createAsyncThunk<
  void,
  { id: number; data: Partial<Client> },
  { rejectValue: string }
>('clients/updateClient', async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    await api.put(`/Client/${id}`, data);
    dispatch(fetchClients({}));
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Failed to update client';
    return rejectWithValue(message);
  }
});

// ===================== DELETE CLIENT =====================
export const deleteClient = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>('clients/deleteClient', async (id, { rejectWithValue, dispatch }) => {
  try {
    await api.delete(`/Client/${id}`);
    dispatch(fetchClients({}));
  } catch (err: any) {
    const message = err.response?.data?.message || err.message || 'Failed to delete client';
    return rejectWithValue(message);
  }
});

// ===================== SLICE =====================
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearClients: (state) => {
      state.clients = [];
      clearClientsStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload.sort((a, b) => a.clientId - b.clientId);;
        saveClientsToStorage(state.clients);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Fetch failed';
      })

      /* CREATE / UPDATE / DELETE (error handling only) */
      .addCase(createClient.rejected, (state, action) => {
        state.error = action.payload ?? 'Create failed';
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.error = action.payload ?? 'Update failed';
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.error = action.payload ?? 'Delete failed';
      });
  },
});

export const { clearClients } = clientSlice.actions;
export default clientSlice.reducer;
