import axios from 'axios'
import { store } from '../redux'
import { setCredentials, clearAuth } from '../redux/slices/authSlice'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})
// Request interceptor: gắn accessToken
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken

  // Chỉ gắn token nếu không phải login/register/logout
  if (
    token &&
    config.headers &&
    !config.url?.includes('/auth/login') &&
    !config.url?.includes('/auth/register') &&
    !config.url?.includes('/auth/logout')
  ) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (config.headers) {
    delete config.headers.Authorization
  }

  return config
})

// Response interceptor: xử lý 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // Nếu là login/register/refresh → không retry
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error)
    }

    // Nếu là 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await refreshApi.post('/auth/refresh-token')  
        const { token, user } = res.data.data

        // Lưu token mới
        store.dispatch(setCredentials({ token, user }))

        // Retry với token mới
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (err) {
        store.dispatch(clearAuth())
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)


export default api
