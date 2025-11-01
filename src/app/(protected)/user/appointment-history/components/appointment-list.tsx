"use client"

import { Card } from "@/components/ui/card"
import AppointmentCard from "./appointment-card"

import { Skeleton } from "@/components/ui/skeleton"
import AppPagination from "@/components/ui/global-pagination"
import { AppointmentDetail } from "@/types/appointment/appointment.type"

interface AppointmentListProps {
  appointments: AppointmentDetail[]
  total: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export default function AppointmentList({
  appointments,
  total,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: AppointmentListProps) {
  const isEmpty = !loading && appointments.length === 0

  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <div className="space-y-6">
      {/* giữ chiều cao ổn định */}
      <div className="min-h-[400px]">
        {loading && !isEmpty ? (

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center h-[400px] border-0 shadow-md">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">
                Không có lịch hẹn nào
              </h3>
              <p className="text-sm">
                Chưa có lịch hẹn nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          </Card>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />

      )}
    </div>
  )
}
