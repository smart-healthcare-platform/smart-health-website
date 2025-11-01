import { apiNoAuth, apiAuth, apiRefresh } from '@/lib/axios'

export const authService = {
  refreshToken: async () => {
    const res = await apiRefresh.post('/auth/refresh-token')
    return res.data.data
  },
  login: async (email: string, password: string) => {
    try {
      const res = await apiNoAuth.post('/auth/login', { email, password })
      console.log('[AUTH SERVICE] ===== LOGIN DEBUG =====')
      console.log('[AUTH SERVICE] Full response:', res)
      console.log('[AUTH SERVICE] Response status:', res.status)
      console.log('[AUTH SERVICE] Response headers:', res.headers)
      console.log('[AUTH SERVICE] Response data:', res.data)
      console.log('[AUTH SERVICE] Response data.data:', res.data?.data)
      console.log('[AUTH SERVICE] Response data.data type:', typeof res.data?.data)
      console.log('[AUTH SERVICE] ===== END DEBUG =====')
      
      // Check if data exists
      if (!res.data || !res.data.data) {
        console.error('[AUTH SERVICE] Invalid response structure:', res.data)
        throw new Error('Invalid response from server')
      }
      
      return res.data.data
    } catch (error: unknown) {
      console.error('[AUTH SERVICE] Login error:', error)
      const axiosError = error as { response?: { data?: unknown; status?: number } }
      if (axiosError.response) {
        console.error('[AUTH SERVICE] Error response:', axiosError.response)
        console.error('[AUTH SERVICE] Error response data:', axiosError.response.data)
        console.error('[AUTH SERVICE] Error response status:', axiosError.response.status)
      }
      throw error
    }
  },
  logout: async () => {
    try {
      await apiAuth.post('/auth/logout')
    } catch (err) {
      console.warn('Logout API failed:', err)
    } finally {
      localStorage.removeItem("isLogin")
      // document.cookie = "refreshToken=; Max-Age=0; path=/;"
    }
  },
}
