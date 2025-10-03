"use client"

import "./globals.css"
import { Provider, useDispatch } from "react-redux"
import { store } from "@/redux"
import { useEffect } from "react"
import { authService } from "@/services/auth.service"
import { setCredentials, clearAuth, setInitialized } from "@/redux/slices/authSlice"
import { apiNoAuth } from "@/lib/axios"

function AuthInit() {
  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      try {
        const { token, user } = await authService.refreshToken()

        // Nếu không có token hoặc user -> coi như fail
        if (!token || !user) throw new Error("Refresh token không hợp lệ")

        let referenceId: string

        if (user.role === "PATIENT") {
          const patient = await apiNoAuth.get(`/patients/by-user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.data)

          referenceId = patient.data.id
        } else if (user.role === "DOCTOR") {
          const doctor = await apiNoAuth.get(`/doctors/by-user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.data)

          referenceId = doctor.data.id
        } else {
          referenceId = ""
        }

        if (!referenceId) throw new Error("Không lấy được referenceId")

        // Lưu redux
        dispatch(setCredentials({
          token,
          user: { ...user, referenceId },
        }))
      } catch (error) {
        console.error("AuthInit error:", error)
        dispatch(clearAuth())
      } finally {
        dispatch(setInitialized())
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
