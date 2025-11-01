"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Appointment } from "@/types/appointment/appointment.type"


interface DayAppointmentsModalProps {
  open: boolean
  onClose: () => void
  date: string
  appointments: Appointment[]
  onAppointmentClick?: (appointment: Appointment) => void
}

export function DayAppointmentsModal({
  open,
  onClose,
  date,
  appointments,
  onAppointmentClick,
}: DayAppointmentsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Lịch hẹn ngày {new Date(date).toLocaleDateString("vi-VN")}</DialogTitle>
          <DialogDescription>
            Có tổng cộng {appointments.length} lịch hẹn trong ngày
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3 border rounded-lg bg-card hover:bg-muted cursor-pointer"
                onClick={() => onAppointmentClick?.(apt)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{apt.patientName}</div>
                  <span className="text-xs text-muted-foreground">
                    {apt.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(apt.startAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {apt.type}
                </div>
                {apt.notes && (
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {apt.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
