// authSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import type { userType } from '../../types/userType';
import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token: any) => {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // בשניות
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

// ======================= Thunks ========================

// Login רגיל עם אימייל וסיסמה
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post('/users/login', {
        userEmail: credentials.email,
        userPassword: credentials.password,
      });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'שגיאה בכניסה');
    }
  }
);

// Login דרך Google – טוקן מתקבל מה-Frontend (לא כולל <GoogleLogin/> כאן!)
export const loginUserWithGoogle = createAsyncThunk(
  'auth/loginUserWithGoogle',
  async (googleToken: string, thunkAPI) => {
    try {
      const res = await axios.post('/google', { token: googleToken });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'שגיאה בהתחברות עם גוגל');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
async (details: any, thunkAPI) => {
    try {
      const { userEmail, code, newPassword } = details;
      const res = await axios.post('/users/reset-password', { userEmail, code, newPassword });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'שגיאה באימות הקוד');
    }
  }
)

export const sendEmailVerification = createAsyncThunk(
  'auth/sendEmailVerification',
  async (email: string, thunkAPI) => {
    try {
      const res = await axios.post('/users/forgot-password', { userEmail: email });
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data || 'שגיאה בשליחת אימייל אימות');
    }
  }
);


// ======================= Slice ========================

interface AuthState {
  currentUser: userType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: localStorage.getItem('currentUser')
    ? JSON.parse(localStorage.getItem('currentUser')!)
    : null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setCurrentUser: (state, action: PayloadAction<userType>) => {
      state.currentUser = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'שגיאה לא ידועה';
      })

      .addCase(loginUserWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUserWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'שגיאה לא ידועה';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.currentUser = action.payload.user;
      }   )
      .addCase(resetPassword.rejected, (state, action) => {  
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'שגיאה לא ידועה';
      })
      .addCase(sendEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendEmailVerification.fulfilled, (state) => {
        state.loading = false;
        state.error = null; // אין צורך לשמור את התגובה, רק להציג הודעה למשתמש
      })
      .addCase(sendEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'שגיאה לא ידועה';
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
  },
});

export const { logout, setToken, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
