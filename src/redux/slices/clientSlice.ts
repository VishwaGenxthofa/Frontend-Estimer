import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Client } from '../../types/Index';
import {
  saveClientsToStorage,
  getClientsFromStorage,
  clearClientsStorage,
} from '../../utils/clientStorage';

/* -------------------- STATE -------------------- */

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

/* -------------------- FETCH -------------------- */

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/Client');

      // ✅ Normalize backend response (IMPORTANT)
      return response.data.data.map((c: any): Client => ({
        clientId: c.clientId ?? c.clientId,
        clientName: c.clientName ?? c.client_name ?? '',
        email: c.email ?? '',
        phone: c.phone ?? '',
        address: c.address ?? '',
        isActive: Boolean(c.isActive),
      }));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- CREATE -------------------- */

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (client: Omit<Client, 'clientId'>, { rejectWithValue }) => {
    try {
      // ✅ Validation
      if (!client.clientName.trim()) {
        return rejectWithValue('Client name is required');
      }

      if (!client.email.trim()) {
        return rejectWithValue('Email is required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(client.email)) {
        return rejectWithValue('Invalid email format');
      }

      if (typeof client.isActive !== 'boolean') {
        return rejectWithValue('Client status is required');
      }

      const response = await api.post('/Client', client);

      return {
        clientId: response.data.clientId ?? response.data.client_id,
        clientName: response.data.clientName ?? '',
        email: response.data.email ?? '',
        phone: response.data.phone ?? '',
        address: response.data.address ?? '',
        isActive: Boolean(response.data.isActive),
      } as Client;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- UPDATE -------------------- */

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async (
    { id, data }: { id: number; data: Partial<Client> },
    { rejectWithValue }
  ) => {
    try {
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return rejectWithValue('Invalid email format');
        }
      }

      const response = await api.put(`/Client/${id}`, data);

      return {
        clientId: response.data.clientId ?? response.data.client_id,
        clientName: response.data.clientName ?? '',
        email: response.data.email ?? '',
        phone: response.data.phone ?? '',
        address: response.data.address ?? '',
        isActive: Boolean(response.data.isActive),
      } as Client;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- DELETE -------------------- */

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/Client/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* -------------------- SLICE -------------------- */

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
      // fetch
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
        saveClientsToStorage(state.clients);
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // create
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.push(action.payload);
        saveClientsToStorage(state.clients);
      })

      // update
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex(
          (c) => c.clientId === action.payload.clientId
        );
        if (index !== -1) {
          state.clients[index] = action.payload;
          saveClientsToStorage(state.clients);
        }
      })

      // delete
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter(
          (c) => c.clientId !== action.payload
        );
        saveClientsToStorage(state.clients);
      });
  },
});

/* -------------------- EXPORTS -------------------- */

export const { clearClients } = clientSlice.actions;
export default clientSlice.reducer;
