import api from '@/lib/axios'

export const authService = {
  refreshToken: async () => {
    const res = await api.post('/auth/refresh-token')
    return res.data.data 
  },
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    return res.data.data 
  },
  logout: async () => {
    const res = await api.post('/auth/logout')
    return res.data 
  },
}
