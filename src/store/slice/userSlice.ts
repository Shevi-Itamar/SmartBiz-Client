import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { userType } from '../../types/userType';

// קריאה לכל המשתמשים
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
            const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error fetching users');
    }
  }
);

// יצירת משתמש
export const addUserAsync = createAsyncThunk(
  'users/addUser',
  async (newUser: userType, thunkAPI) => {
    try {

      const res = await axios.post('/users', newUser);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error creating user');
    }
  }
);

// עדכון משתמש
export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async (updatedUser: userType, thunkAPI) => {
    try {
      console.log('updateUserAsync called with:', updatedUser);
      const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
      const res = await axios.put(`/users/${state.auth.currentUser.userEmail}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error updating user');
    }
  }
);

// מחיקת משתמש
export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (userEmail: string, thunkAPI) => {
          const state: any = thunkAPI.getState(); // שליפת ה־state
      const token = state.auth.token;
      if (!token) {
        return thunkAPI.rejectWithValue('לא מחובר');
      }
    try {
      await axios.delete(`/users/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return userEmail;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'error deleting user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [] as userType[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ADD
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex(u => u.userEmail === action.payload.userEmail);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u.userEmail !== action.payload);
      })

      // ERROR HANDLING
      .addMatcher(
        (action) => action.type.startsWith('users/') && action.type.endsWith('/rejected'),
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

export default userSlice.reducer;
