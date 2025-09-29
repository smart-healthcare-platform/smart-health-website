"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Table, Plus } from "lucide-react"
import { AppointmentTable } from "./appointment-table"
import { AppointmentCalendar } from "./appointment-cenlendar"
import type { ViewMode } from "@/types/appointment"

export function AppointmentManager() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")

  const handleCreateAppointment = () => {
    console.log("Create new appointment")
    // TODO: mở modal thêm lịch hẹn
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý lịch hẹn</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi lịch hẹn của bệnh nhân
          </p>
        </div>
        <Button onClick={handleCreateAppointment} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm lịch hẹn
        </Button>
      </div>

      {/* Toggle view */}
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

        {/* Bảng */}
        <TabsContent value="table" className="mt-6">
          {/* TODO: hiển thị bảng lịch hẹn */}
          {/* <AppointmentTable /> */}
        </TabsContent>

        {/* Lịch */}
        <TabsContent value="calendar" className="mt-6">
          <AppointmentCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}
