import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slice/userSlice';
import serviceReducer from '../store/slice/serviceSlice';
import meetingReducer from '../store/slice/meetingSlice';
import businessReducer from '../store/slice/businessSlice';
import authReducer from '../store/slice/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    services: serviceReducer,
    meetings: meetingReducer,
    business: businessReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;