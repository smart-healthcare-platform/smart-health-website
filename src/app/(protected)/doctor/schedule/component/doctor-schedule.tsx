"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Plus } from "lucide-react"
import { ScheduleModal } from "./schedule-modal"
import { WeeklyAvailability } from "@/types/doctor/doctor.type"
import { useSelector } from "react-redux"
import { RootState } from "@/redux"
import { doctorService } from "@/services/doctor.service"

const ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

const DAY_MAP: Record<string, string> = {
  MON: "Thứ 2",
  TUE: "Thứ 3",
  WED: "Thứ 4",
  THU: "Thứ 5",
  FRI: "Thứ 6",
  SAT: "Thứ 7",
  SUN: "Chủ nhật",
}

export function DoctorSchedule() {
  const doctorId = useSelector((state: RootState) => state.auth.user?.referenceId);

  const [schedules, setSchedules] = useState<WeeklyAvailability[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WeeklyAvailability | null>(null)

  const fetchSchedules = async () => {
    if (!doctorId) return;
    const res = await doctorService.getWeeklySchedule(doctorId);

    setSchedules((res || []).sort(
      (a, b) => ORDER.indexOf(a.day_of_week) - ORDER.indexOf(b.day_of_week)
    ));
  };

  useEffect(() => {
    fetchSchedules()
  }, [doctorId])

  const fmt = (t: string) => t.slice(0, 5)

  const stats = useMemo(() => {
    let totalSlot = schedules.length
    let fullDay = 0
    let halfDay = 0
    let totalHours = 0

    schedules.forEach(s => {
      const sH = Number(s.start_time.slice(0, 2))
      const eH = Number(s.end_time.slice(0, 2))

      if (s.start_time === "08:00" && s.end_time === "17:00") fullDay++
      else halfDay++

      totalHours += (eH - sH)
    })

    return { totalSlot, fullDay, halfDay, totalHours }
  }, [schedules])

  const handleSave = async (item: WeeklyAvailability) => {
    let newData = schedules.map(s => ({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time
    }))

    if (editingItem) {
      newData = newData.map(s =>
        s.day_of_week === item.day_of_week ? { ...item } : s
      )
    } else {
      newData.push(item)
    }

    await doctorService.createOrUpdateWeeklyAvailability(doctorId!, newData)
    await fetchSchedules()
    setEditingItem(null)
    setIsModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    const remain = schedules.filter(s => s.id !== id)
    const mapped = remain.map(s => ({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time
    }))

    await doctorService.createOrUpdateWeeklyAvailability(doctorId!, mapped)
    await fetchSchedules()
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Lịch Làm Việc Hàng Tuần</h2>
        <Button
          onClick={() => { setEditingItem(null); setIsModalOpen(true) }}
          className="gap-2 bg-teal-500 hover:bg-teal-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Thêm
        </Button>
      </div>


      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatBox label="Tổng ca làm" value={`${stats.totalSlot}`} />
        <StatBox label="Nguyên ngày" value={`${stats.fullDay}`} />
        <StatBox label="Nửa ngày" value={`${stats.halfDay}`} />
        <StatBox label="Tổng giờ" value={`${stats.totalHours}h`} />
      </div>


      {/* TABLE */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-6 py-4 text-left">Ngày</th>
              <th className="px-6 py-4 text-left">Khung Giờ</th>
              <th className="px-6 py-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(item => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-4 font-medium">
                  {DAY_MAP[item.day_of_week]}
                </td>
                <td className="px-6 py-4">
                  {fmt(item.start_time)} - {fmt(item.end_time)}
                </td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditingItem(item); setIsModalOpen(true) }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
        existingDays={schedules.map(s => s.day_of_week)}
      />
    </div>
  )
}


function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-white border rounded-lg">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-bold text-xl">{value}</p>
    </div>
  )
}
