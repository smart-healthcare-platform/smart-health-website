"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface CalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  availableDates?: string[]
}

const Calendar = ({ selectedDate, onDateSelect, availableDates = [] }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null)
  const [today, setToday] = useState<Date | null>(null)

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now)
    setToday(now)
  }, [])

  // tránh render trước khi có dữ liệu ngày
  if (!currentMonth || !today) return null

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const monthNames = [
    "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
    "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
  ]

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

  const goToPreviousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return date >= today && availableDates.includes(dateStr)
  }

  const isDateSelected = (date: Date) =>
    selectedDate && isSameDate(date, selectedDate)

  const renderCalendarDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isAvailable = isDateAvailable(date)
      const isSelected = isDateSelected(date)
      const isToday = isSameDate(date, today)

      days.push(
        <button
          key={day}
          onClick={() => isAvailable && onDateSelect(date)}
          disabled={!isAvailable}
          className={`p-2 text-sm rounded-lg transition-all duration-200 relative font-medium ${
            isSelected
              ? "bg-emerald-600 text-white font-bold shadow-lg ring-2 ring-emerald-300 transform scale-105"
              : isToday && isAvailable
              ? "bg-emerald-100 text-emerald-800 font-semibold border-2 border-emerald-400"
              : isAvailable
              ? "hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 border border-gray-200 hover:border-emerald-300 hover:shadow-sm"
              : "text-gray-400 cursor-not-allowed bg-gray-50 border border-gray-100"
          }`}
        >
          {day}
          {isSelected && <div className="absolute rounded-full "></div>}
        </button>
      )
    }
    return days
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Chọn ngày khám</h3>
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-gray-700 min-w-24 text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      <div className="mt-4 text-xs text-gray-500">Chỉ có thể đặt lịch từ hôm nay trở đi</div>
    </div>
  )
}

export default Calendar
