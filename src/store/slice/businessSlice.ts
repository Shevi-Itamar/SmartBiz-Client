import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { businessType } from '../../types/businessType';
import {isTokenValid}  from './authSlice';

// קריאה לפרטי העסק
export const fetchBusiness = createAsyncThunk(
  'business/fetchBusiness',
  async (_, thunkAPI) => {
    
    try {
      const res = await axios.get('/business');
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'שגיאה בטעינת העסק');
    }
  }
);

// עדכון פרטי העסק
export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async (updatedBusiness: businessType, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!isTokenValid(token)) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.put('/business', updatedBusiness, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'שגיאה בעדכון העסק');
    }
  }
);

interface BusinessState {
  details: businessType | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  details: null,
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.details = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith('business/') && action.type.endsWith('/rejected'),
        (state, action) => {
          if ('payload' in action) {
            state.error = action.payload as string;
          } else {
            state.error = 'Unknown error';
          }
        }
      );
  },
});

export default businessSlice.reducer;
