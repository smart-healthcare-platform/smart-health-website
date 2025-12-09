"use client"
import { DoctorFormInput } from "@/types/doctor/doctor-form-input"
import { DayOfWeek } from "@/types/doctor/dto/create-weekly.dto"

export default function Step3Schedule({ data, setData }: { data: DoctorFormInput, setData: any }) {

  const toggleDay = (day_of_week: DayOfWeek, checked: boolean) => {
    if (checked) {
      if (!data.weeklyAvailability.find(d => d.day_of_week === day_of_week)) {
        setData({
          ...data,
          weeklyAvailability: [...data.weeklyAvailability, { day_of_week, start_time: "", end_time: "" }]
        })
      }
    } else {
      setData({
        ...data,
        weeklyAvailability: data.weeklyAvailability.filter(d => d.day_of_week !== day_of_week)
      })
    }
  }

  const updateTime = (day_of_week: DayOfWeek, key: "start_time" | "end_time", value: string) => {
    setData({
      ...data,
      weeklyAvailability: data.weeklyAvailability.map(d =>
        d.day_of_week === day_of_week ? { ...d, [key]: value } : d
      )
    })
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
      {Object.values(DayOfWeek).map(day => {
        const isSelected = !!data.weeklyAvailability.find(d => d.day_of_week === day)
        const dayData = data.weeklyAvailability.find(d => d.day_of_week === day)
        return (
          <div key={day} className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={e => toggleDay(day, e.target.checked)}
            />
            <span className="w-24 font-medium">{day}</span>

            <select
              value={dayData?.start_time || ""}
              disabled={!isSelected}
              onChange={e => updateTime(day, "start_time", e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Chọn giờ bắt đầu</option>
              <option value="08:00">08:00</option>
              <option value="12:00">12:00</option>
            </select>

            <select
              value={dayData?.end_time || ""}
              disabled={!isSelected}
              onChange={e => updateTime(day, "end_time", e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Chọn giờ kết thúc</option>
              <option value="12:00">12:00</option>
              <option value="17:00">17:00</option>
            </select>
          </div>
        )
      })}
    </div>
  )
}
