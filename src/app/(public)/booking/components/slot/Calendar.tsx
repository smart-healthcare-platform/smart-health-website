"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, ReactNode } from "react"

interface CalendarProps {
  selectedDate: string | null  // yyyy-MM-dd
  onDateSelect: (date: string) => void
  availableDates?: string[]    // yyyy-MM-dd[]
}

const Calendar = ({ selectedDate, onDateSelect, availableDates = [] }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null)
  const [today, setToday] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const now = new Date()
    setCurrentMonth(now)
    setToday(now)
    setMounted(true)
  }, [])

  if (!mounted || !currentMonth || !today) return null

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ]

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

  const goToPreviousMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const isDateAvailable = (dateStr: string) => {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`
    return dateStr >= todayStr && availableDates.includes(dateStr)
  }

  const renderDays = (): ReactNode => {
    const days: ReactNode[] = []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()

    // empty days before first day
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />)

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = formatDate(year, month, d)
      const selected = selectedDate === dateStr
      const available = isDateAvailable(dateStr)

      days.push(
        <button
          key={dateStr}
          onClick={() => available && onDateSelect(dateStr)}
          disabled={!available}
          className={`p-2 text-sm rounded-lg transition-all duration-200 font-medium
            ${selected ? "bg-emerald-600 text-white shadow-lg" : ""}
            ${available && !selected ? "hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200" : "text-gray-400 cursor-not-allowed"}
          `}
        >
          {d}
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
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
      <div className="mt-4 text-xs text-gray-500">Chỉ có thể đặt lịch từ hôm nay trở đi</div>
    </div>
  )
}

export default Calendar
