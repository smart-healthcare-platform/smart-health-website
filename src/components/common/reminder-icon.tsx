"use client"

import { useState, useRef, useEffect } from "react"
import { appointmentService } from "@/services/appointment.service"
import { doctorService } from "@/services/doctor.service"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/redux"
import type { FollowUpSuggestion } from "@/types/examnation"
import { useRouter } from "next/navigation"
import { setDoctor, setFollowUpBooking } from "@/redux/slices/bookingSlice"

interface Reminder {
  id: string
  doctorId: string
  title: string
  message: string
  time: string
  read: boolean
}

export default function ReminderIcon() {
  const [isOpen, setIsOpen] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const reminderRef = useRef<HTMLDivElement | null>(null)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user?.referenceId) return
      try {
        setLoading(true)
        const data = await appointmentService.getPendingFollowUpByPatient(user.referenceId)
        const remindersMapped: Reminder[] = data.map((item: FollowUpSuggestion) => ({
          id: item.id,
          doctorId: item.doctorId,
          title: "Đề xuất tái khám",
          message: item.reason || "Bạn có đề xuất tái khám từ bác sĩ.",
          time: item.suggestedDate
            ? new Date(item.suggestedDate).toLocaleDateString("vi-VN")
            : "Chưa có ngày",
          read: false,
        }))
        setReminders(remindersMapped)
      } catch (err) {
        console.error("Lỗi khi tải danh sách tái khám:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReminders()
  }, [user?.referenceId])

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reminderRef.current && !reminderRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleReminderClick = async (id: string) => {
    const selected = reminders.find((r) => r.id === id)
    if (!selected) return

    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, read: true } : r)))

    try {
      const doctor = await doctorService.getDoctorById(selected.doctorId)

      dispatch(setDoctor(doctor))
      dispatch(setFollowUpBooking({ followUpId: selected.id }))
      router.push("/booking/step-2")
    } catch (error) {
      console.error("Không thể lấy thông tin bác sĩ:", error)
    }
  }

  const unreadCount = reminders.filter((r) => !r.read).length

  return (
    <div className="relative" ref={reminderRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Nhắc nhở"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        {/* Badge count */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full translate-x-1/3 -translate-y-1/3">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 rounded-t-xl">
            <h3 className="font-semibold text-gray-900">
              Nhắc nhở tái khám
              {loading && <span className="ml-2 text-sm text-gray-400">(đang tải...)</span>}
            </h3>
          </div>

          {/* Danh sách nhắc nhở */}
          {!loading && reminders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {reminders.map((reminder) => (
                <button
                  key={reminder.id}
                  onClick={() => handleReminderClick(reminder.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!reminder.read ? "bg-emerald-50" : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                        {!reminder.read && (
                          <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{reminder.message}</p>
                      <p className="text-xs text-gray-500 mt-2">Ngày gợi ý: {reminder.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 text-sm">Không có nhắc nhở nào</p>
              </div>
            )
          )}

          {/* Footer */}
          {!loading && reminders.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 rounded-b-xl">
              <button className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2">
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
