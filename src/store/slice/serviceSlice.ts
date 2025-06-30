import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { serviceType } from '../../types/serviceType';

// ======================= Thunks ========================

// 1. קריאה לקבלת כל השירותים
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/services');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error fetching services');
    }
  }
);

export const fetchServicesByID = createAsyncThunk(
  'services/fetchServicesByID',
  async (serviceID: string, thunkAPI) => {
    try {
      const res = await axios.get(`/services/${serviceID}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error fetching services');
    }
  }
);

// 2. יצירת שירות חדש
export const createService = createAsyncThunk(
  'services/createService',
  
  async (newService: serviceType, thunkAPI) => {
    try {
            const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.post('/services', newService, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error creating service');
    }
  }
);

// 3. עדכון שירות קיים
export const updateService = createAsyncThunk(
  'services/updateService',
  async (service: serviceType, thunkAPI) => {
    try {
            const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.put(`/services/${service._id}`, service, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error updating service');
    }
  }
);

// 4. מחיקת שירות
export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: string, thunkAPI) => {
    try {
            const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      await axios.delete(`/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error deleting service');
    }
  }
);

// ======================= Slice ========================

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    list: [] as serviceType[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ----- Fetch All -----
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ----- Create -----
      .addCase(createService.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ----- Update -----
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ----- Delete -----
      .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s._id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default serviceSlice.reducer;
