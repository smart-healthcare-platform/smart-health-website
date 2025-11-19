"use client"

import "./globals.css"
import { Provider, useDispatch, useSelector } from "react-redux"
import { store, RootState } from "@/redux"
import { useEffect } from "react"
import { authService } from "@/services/auth.service"
import { setCredentials, clearAuth, setInitialized } from "@/redux/slices/authSlice"
import { apiNoAuth } from "@/lib/axios"
import { NotificationProvider } from "@/components/NotificationProvider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function AuthInit() {
  const dispatch = useDispatch()

  useEffect(() => {
    const init = async () => {
      const isLogin = localStorage.getItem("isLogin");
      if (!isLogin) {
        dispatch(setInitialized());
        return;
      }
      try {
        const { token, user } = await authService.refreshToken();
        if (!token || !user) throw new Error("Refresh token không hợp lệ");

        if (user.role === "PATIENT") {
          const patientRes = await apiNoAuth.get(`/patients/by-user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const patient = patientRes.data.data;

          dispatch(
            setCredentials({
              token,
              user: {
                ...user,
                role: "PATIENT",
                referenceId: patient.id,
                profile: {
                  fullName: patient.full_name,
                  gender: patient.gender,
                  address: patient.address,
                  dateOfBirth: patient.date_of_birth,
                },
              },
            })
          );
        } else if (user.role === "DOCTOR") {
          const doctorRes = await apiNoAuth.get(`/doctors/by-user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const doctor = doctorRes.data.data

          dispatch(
            setCredentials({
              token,
              user: {
                ...user,
                role: "DOCTOR",
                referenceId: doctor.id,
                profile: {
                  fullName: doctor.full_name,
                  gender: doctor.gender,
                  specialty: doctor.specialty,
                  dateOfBirth: doctor.date_of_birth,
                  yearsOfExperience: doctor.experience_years,
                  avatar: doctor.avatar
                },
              },
            })
          );
        } else if (user.role === "RECEPTIONIST") {
          // For now, use basic user info until we have receptionist service
          dispatch(
            setCredentials({
              token,
              user: {
                ...user,
                role: "RECEPTIONIST",
                referenceId: user.id,
                profile: {
                  fullName: user.username || "Lễ tân",
                  employeeId: user.id,
                  department: "Front Desk",
                  shift: "full-time",
                },
              },
            })
          );
        } else if (user.role === "ADMIN") {
          // Admin doesn't need profile fetch
          dispatch(
            setCredentials({
              token,
              user: {
                ...user,
                role: "ADMIN",
              },
            })
          );
        }

        dispatch(setInitialized());
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

function AppContent({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?.id

  return (
    <>
      <AuthInit />
      <NotificationProvider userId={userId}>{children}</NotificationProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Provider store={store}>
          <AppContent>{children}</AppContent>
        </Provider>
      </body>
    </html>
  )
}
