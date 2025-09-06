import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  username: string
  role: string
  createdAt: string
}

interface AuthState {
  accessToken: string | null
  user: User | null
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.accessToken = action.payload.token
      state.user = action.payload.user
    },
    clearAuth: (state) => {
      state.accessToken = null
      state.user = null
    },
  },
})

export const { setCredentials, clearAuth } = authSlice.actions
export default authSlice.reducer
