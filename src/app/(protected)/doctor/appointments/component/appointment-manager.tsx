"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Table, Plus } from "lucide-react"
import { AppointmentTable } from "./appointment-table"
import { AppointmentCalendar } from "./appointment-cenlendar"
import { useAppointments } from "@/hooks/useAppointments"
import type { Appointment, ViewMode } from "@/types/appointment"

export function AppointmentManager() {
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const { appointments, loading, updateAppointment, deleteAppointment } = useAppointments()

  const handleEdit = (appointment: Appointment) => {
    // TODO: Open edit modal
    console.log("Edit appointment:", appointment)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) {
      await deleteAppointment(id)
    }
  }

  const handleStatusChange = async (id: string, status: Appointment["status"]) => {
    await updateAppointment(id, { status })
  }

  const handleDateSelect = (date: string) => {
    // TODO: Filter appointments by selected date or open create modal
    console.log("Selected date:", date)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    // TODO: Open appointment details modal
    console.log("Clicked appointment:", appointment)
  }

  const handleCreateAppointment = () => {
    // TODO: Open create appointment modal
    console.log("Create new appointment")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Quản lý lịch hẹn</h1>
          <p className="text-muted-foreground mt-1">Quản lý và theo dõi lịch hẹn của bệnh nhân</p>
        </div>
        <Button onClick={handleCreateAppointment} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm lịch hẹn
        </Button>
      </div>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="table" className="gap-2">
            <Table className="w-4 h-4" />
            Bảng
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="w-4 h-4" />
            Lịch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <AppointmentTable
            appointments={appointments}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <AppointmentCalendar
            appointments={appointments}
            loading={loading}
            onDateSelect={handleDateSelect}
            onAppointmentClick={handleAppointmentClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
