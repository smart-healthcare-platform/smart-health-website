import { User } from "@/types/auth/auth-type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isInitialized = true;
      
      // Sync token to localStorage for auth-helpers compatibility
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("userId", action.payload.user.id);
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isInitialized = true;
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLogin");
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, clearAuth, setInitialized } = authSlice.actions;
export default authSlice.reducer;
