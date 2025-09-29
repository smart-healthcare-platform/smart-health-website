"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import AppointmentCard from "./appointment-card"
import type { Appointment } from "@/types/appointment"

interface AppointmentListProps {
  appointments: Appointment[]
  total: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function AppointmentList({
  appointments,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: AppointmentListProps) {
  const getStatusCounts = () => {
    const counts = {
      total: total,
      completed: appointments.filter((apt) => apt.status === "completed").length,
      confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
      cancelled: appointments.filter((apt) => apt.status === "cancelled").length,
    }
    return counts
  }

  const statusCounts = getStatusCounts()

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">


      {appointments.length > 0 ? (
        <>
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>

          {totalPages > 1 && (
            <Card className="p-4 border-0 shadow-md">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Trang {currentPage} / {totalPages} • Tổng {total} lịch hẹn
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page = i + 1
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          page = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i
                        } else {
                          page = currentPage - 2 + i
                        }
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(page)}
                          className={currentPage === page ? "bg-primary text-primary-foreground" : "bg-transparent"}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="bg-transparent"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-12 text-center border-0 shadow-md">
          <div className="text-muted-foreground">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">Không có lịch hẹn nào</h3>
            <p className="text-sm">Chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        </Card>
      )}
    </div>
  )
}
