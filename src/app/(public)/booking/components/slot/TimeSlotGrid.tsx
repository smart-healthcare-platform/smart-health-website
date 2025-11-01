"use client"

import { TimeSlot } from "@/types/timeSlot"
import type React from "react"

export type TimeSlotStatus = "available" | "booked" | "off" | "expired"


interface TimeSlotGridProps {
  selectedSlotId: string | null
  onSlotSelect: (slot: TimeSlot) => void
  selectedDate: string | null // <-- sửa từ Date | null thành string | null
  timeSlots: TimeSlot[]
  loading?: boolean
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  selectedSlotId,
  onSlotSelect,
  selectedDate,
  timeSlots,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
        Chọn giờ khám
      </h3>

      {!selectedDate && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">📅</div>
          <p className="text-gray-500 text-sm">Vui lòng chọn ngày trước</p>
        </div>
      )}

      {selectedDate && loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Đang tải lịch khám...</p>
        </div>
      )}

      {selectedDate && !loading && timeSlots.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">❌</div>
          <p className="text-gray-500 text-sm">Không có lịch khám trong ngày này</p>
        </div>
      )}

      {selectedDate && !loading && timeSlots.length > 0 && (
        <>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
              <span className="text-gray-600">Có thể đặt</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 rounded"></div>
              <span className="text-gray-600">Đã đặt</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span className="text-gray-600">Nghỉ</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <span className="text-gray-600">Đã qua</span>
            </div>
          </div>

          {/* Time slots */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const isDisabled = slot.status !== "available"
              const isSelected = selectedSlotId === slot.id


              return (
                <button
                  key={slot.time}
                  onClick={() => !isDisabled && onSlotSelect(slot)}
                  disabled={isDisabled}
                  className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 border ${slot.status === "available"
                      ? isSelected
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-md scale-105"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 border-emerald-200 hover:shadow-sm"
                      : slot.status === "booked"
                        ? "bg-red-50 text-red-400 cursor-not-allowed border-red-200"
                        : slot.status === "off"
                          ? "bg-yellow-50 text-yellow-600 cursor-not-allowed border-yellow-200"
                          : "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
                    }`}
                >
                  {slot.time}
                  {slot.status === "booked" && <div className="text-xs mt-1"></div>}
                  {slot.status === "off" && <div className="text-xs mt-1">Nghỉ</div>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default TimeSlotGrid
