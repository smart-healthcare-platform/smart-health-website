"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Table, Plus } from "lucide-react"
import { AppointmentCalendar } from "./appointment-cenlendar"
import { useSelector } from "react-redux"
import { RootState } from "@/redux"
import { AppointmentTable } from "./appointment-table"
import { useAppointments } from "@/hooks/use-appointments"
import { StatCards } from "./start-card"

export function AppointmentManager() {
  const doctorId = useSelector((state: RootState) => state.auth.user?.referenceId)
  const { appointments, loading } = useAppointments(doctorId)
  const [viewMode, setViewMode] = useState("calendar")

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10)
    return {
      total: appointments.length,
      today: appointments.filter(a => a.startAt.startsWith(todayStr)).length,
      completed: appointments.filter(a => a.status === "COMPLETED").length
    }
  }, [appointments])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Lịch khám bệnh</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Thêm lịch hẹn
        </Button>
      </div>
      {/* STAT CARDS */}
      <StatCards total={stats.total} today={stats.today} completed={stats.completed} />

      {/* TITLE + BUTTON */}


      {/* TABS */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsList className="grid grid-cols-2 w-fit">

          <TabsTrigger value="calendar"><Calendar className="w-4 h-4" /> Lịch</TabsTrigger>
          <TabsTrigger value="table"><Table className="w-4 h-4" /> Bảng</TabsTrigger>
        </TabsList>



        <TabsContent value="calendar">
          <AppointmentCalendar appointments={appointments} loading={loading} />
        </TabsContent>
        <TabsContent value="table">
          <AppointmentTable appointments={appointments} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
