"use client"

import { Appointment } from "@/types/appointment/appointment.type"
import { AppointmentStatus } from "@/types/appointment/index"



interface TodayScheduleProps {
  appointments: Appointment[]
}

// --- Helpers ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatTime = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function TodaySchedule({ appointments }: TodayScheduleProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg">
      {appointments.length === 0 ? (
        <p className="text-muted-foreground text-sm">Không có lịch khám hôm nay</p>
      ) : (
        <ul
          className={`space-y-4 ${
            appointments.length > 4 ? "max-h-[320px] overflow-y-auto pr-2" : ""
          }`}
        >
          {appointments.map((item, idx) => (
            <li
              key={idx}
              className="border border-gray-100 p-4 rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
            >
              <div>
                <p className="font-semibold text-gray-900">{item.patientName}</p>
                <div className="text-sm text-gray-500">
                  <p>{formatDate(item.startAt)}</p>
                  <p className="font-medium text-gray-700">{formatTime(item.startAt)}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  item.status === AppointmentStatus.COMPLETED
                    ? "bg-green-100 text-green-700"
                    : item.status === AppointmentStatus.CANCELLED
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status === AppointmentStatus.COMPLETED
                  ? "Đã khám"
                  : item.status ===AppointmentStatus.CANCELLED
                  ? "Hủy"
                  : "Chờ khám"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        ul::-webkit-scrollbar {
          width: 6px;
        }
        ul::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 9999px;
        }
        ul::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
    </div>
  )
}
