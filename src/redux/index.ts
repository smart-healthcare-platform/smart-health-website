import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from "./slices/bookingSlice";
import chatReducer from './slices/chatSlice'; // Import chatSlice
export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    chat: chatReducer, // Add chat reducer to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
