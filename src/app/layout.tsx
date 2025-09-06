'use client'

import './globals.css'
import { Provider, useDispatch } from 'react-redux'
import { store } from '@/store'
import { useEffect } from 'react'
import { authService } from '@/services/authService'
import { setCredentials, clearAuth } from '@/store/slices/authSlice'

// Component client side để init auth khi load app
function AuthInit() {
  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      try {
        // Gọi refresh token (cookie HttpOnly)
        const { token, user } = await authService.refreshToken()
        dispatch(setCredentials({ token, user }))
      } catch (error) {
        console.log('User not logged in or refresh token expired')
        dispatch(clearAuth())
      }
    }
    init()
  }, [dispatch])

  return null
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          <AuthInit />
          {children}
        </Provider>
      </body>
    </html>
  )
}
