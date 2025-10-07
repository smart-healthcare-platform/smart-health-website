"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Table, Plus } from "lucide-react"
import { AppointmentCalendar } from "./appointment-cenlendar"
import type { ViewMode } from "@/types/appointment"
import { useSelector } from "react-redux"
import { RootState } from "@/redux"

export function AppointmentManager() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const doctorId = useSelector((state: RootState) => state.auth.user?.referenceId);
  const handleCreateAppointment = () => {
    // mở modal hoặc điều hướng sang trang tạo lịch hẹn
    console.log("Create new appointment");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lịch khám bệnh</h1>
        </div>
        <Button onClick={handleCreateAppointment} className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm lịch hẹn
        </Button>
      </div>

      {/* Toggle view */}
      <Tabs
        value={viewMode}
        onValueChange={(val) => setViewMode(val as ViewMode)}
      >
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

        {/* View: Bảng */}
        <TabsContent value="table" className="mt-6">
          {/* <AppointmentTable /> */}
          <div className="text-center py-12 text-muted-foreground">
            <Table className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Chế độ xem bảng đang được phát triển</p>
          </div>
        </TabsContent>

        {/* View: Lịch */}
        <TabsContent value="calendar" className="mt-6">
          <TabsContent value="calendar" className="mt-6">
            {doctorId ? (
              <AppointmentCalendar doctorId={doctorId} />
            ) : (
              <p className="text-muted-foreground">Không tìm thấy Doctor ID</p>
            )}
          </TabsContent>
        </TabsContent>
      </Tabs>
    </div>
  );
}
