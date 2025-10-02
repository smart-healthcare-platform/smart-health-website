'use client'

import './globals.css'
import { Provider, useDispatch } from 'react-redux'
import { store } from '@/redux'
import { useEffect } from 'react'
import { authService } from '@/services/auth.service'
import { setCredentials, clearAuth, setInitialized } from '@/redux/slices/authSlice'
import { apiNoAuth } from '@/lib/axios'

function AuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const { token, user } = await authService.refreshToken()
        console.log(token);
        let patientId = ""
        if (user.role === "PATIENT") {
          const patient = await apiNoAuth.get(`/patients/by-user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.data)
          patientId = patient.data.id
        }

        dispatch(setCredentials({
          token,
          user: { ...user, patientId }
        }))
      } catch (error) {
        console.log("Không có refreshToken hợp lệ");
        dispatch(clearAuth());
      } finally {
        dispatch(setInitialized());
      }
    };
    init();
  }, [dispatch]);

  return null;
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
