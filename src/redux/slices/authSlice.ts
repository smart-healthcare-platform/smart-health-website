import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  username: string
  role: string
  createdAt: string
  patientId?: string
}

interface AuthState {
  accessToken: string | null
  user: User | null
  isInitialized: boolean // Thêm field này
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isInitialized: false, // Mặc định chưa khởi tạo
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
      state.isInitialized = true 
    },
    clearAuth: (state) => {
      state.accessToken = null
      state.user = null
      state.isInitialized = true
    },
    setInitialized: (state) => {
      state.isInitialized = true 
    },
  },
})

export const { setCredentials, clearAuth, setInitialized } = authSlice.actions
export default authSlice.reducer