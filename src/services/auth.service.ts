import { apiNoAuth, apiAuth, apiRefresh } from '@/lib/axios'
import { UserAccount } from '@/types/auth/auth-type'

export const authService = {
  refreshToken: async () => {
    const res = await apiRefresh.post('/auth/refresh-token')
    return res.data.data
  },
  login: async (email: string, password: string) => {
    try {
      const res = await apiNoAuth.post('/auth/login', { email, password })
      
      // Check if data exists
      if (!res.data || !res.data.data) {
        console.error('[AUTH SERVICE] Invalid response structure:', res.data)
        throw new Error('Invalid response from server')
      }
      
      return res.data.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown; status?: number } }
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

  getUserById: async (userId: string) => {
    try {
      const res = await apiAuth.get(`/auth/users/${userId}`)

      if (!res.data.success) {
        throw new Error(res.data.message || 'Không lấy được thông tin người dùng')
      }

      return res.data.data
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status

        if (status === 403) {
          console.warn("Không đủ quyền truy cập API /auth/users/:id")
        }
        if (status === 404) {
          console.warn("Không tìm thấy người dùng")
        }
      }

      throw error
    }
  },
  deActiveUser: async (userId: string): Promise<UserAccount> => {
    try {
      const res = await apiAuth.put(`/auth/users/de-active/${userId}`)

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || 'Không thể vô hiệu hóa tài khoản')
      }

      return res.data.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown; status?: number } }

      if (axiosError.response) {
        console.error('[USER SERVICE] Error response:', axiosError.response)
        if (axiosError.response.status === 404) {
          throw new Error('Người dùng không tồn tại')
        }
        if (axiosError.response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện hành động này')
        }
      }

      throw error
    }
  },

  activeUser: async (userId: string): Promise<UserAccount> => {
    try {
      const res = await apiAuth.put(`/auth/users/active/${userId}`)

      if (!res.data.success || !res.data.data) {
        throw new Error(res.data.message || 'Không thể kích hoạt tài khoản')
      }

      return res.data.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: unknown; status?: number } }

      if (axiosError.response) {
        console.error('[USER SERVICE] Error response:', axiosError.response)
        if (axiosError.response.status === 404) {
          throw new Error('Người dùng không tồn tại')
        }
        if (axiosError.response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện hành động này')
        }
      }

      throw error
    }
  }
}
