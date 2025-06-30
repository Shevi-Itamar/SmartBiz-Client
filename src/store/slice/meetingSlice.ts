import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { meetingType } from '../../types/meetingType';
// קריאה לכל הפגישות
export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async (_, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.get('/meeting', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error fetching meetings');
    }
  }
);

export const getMeetingsByEmail = createAsyncThunk(
  'meetings/getMeetingsByEmail',
  async (userEmail:string|undefined, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.get(`/meeting/user/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error fetching meetings');
    }
  }
);


// יצירת פגישה
export const addMeetingAsync = createAsyncThunk(
  'meetings/addMeeting',
  async (newMeeting: meetingType, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.post('/meeting', newMeeting, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error creating meeting');
    }
  }
);


// עדכון פגישה
export const updateMeetingAsync = createAsyncThunk(
  'meetings/updateMeeting',
  async (updatedMeeting: meetingType, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.token; if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.put(`/meeting/${updatedMeeting._id}`, updatedMeeting, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error updating meeting');
    }
  }
);

// מחיקת פגישה
export const deleteMeetingAsync = createAsyncThunk(
  'meetings/deleteMeeting',
  async (meetingId: string, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState();
      const token = state.auth.token; if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      await axios.delete(`/meeting/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return meetingId;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error deleting meeting');
    }
  }
);

export const getAvailableHours = createAsyncThunk(
  'meetings/availableHours',
  async (selectedDate: string, thunkAPI) => {
    try {
      const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.get(`/meeting/free-hours/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error get available hours');
    }
  }
);

const meetingSlice = createSlice({
  name: 'meetings',
  initialState: {
    list: [] as meetingType[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addMeetingAsync.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateMeetingAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteMeetingAsync.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith('meetings/') && action.type.endsWith('/rejected'),
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

export default meetingSlice.reducer;
