"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, User, Phone, MoreHorizontal, Search, Filter } from "lucide-react"
import type { Appointment } from "@/types/appointment"

interface AppointmentTableProps {
  appointments: Appointment[]
  loading?: boolean
  onEdit?: (appointment: Appointment) => void
  onDelete?: (id: string) => void
  onStatusChange?: (id: string, status: Appointment["status"]) => void
}

export function AppointmentTable({
  appointments,
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<Appointment["status"] | "all">("all")

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: Appointment["status"]) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
      completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    }

    const labels = {
      confirmed: "Đã xác nhận",
      pending: "Chờ xác nhận",
      cancelled: "Đã hủy",
      completed: "Hoàn thành",
    }

    return <Badge className={variants[status]}>{labels[status]}</Badge>
  }

  const getTypeBadge = (type: Appointment["type"]) => {
    return <Badge variant="outline">{type}</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Danh sách lịch hẹn</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Tất cả</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("confirmed")}>Đã xác nhận</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Chờ xác nhận</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Hoàn thành</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Đã hủy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Loại khám</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Không có lịch hẹn nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {appointment.startTime} - {appointment.endTime}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{appointment.patient}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{appointment.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(appointment.type)}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {appointment.notes || "Không có ghi chú"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit?.(appointment)}>Chỉnh sửa</DropdownMenuItem>
                          {appointment.status === "pending" && (
                            <DropdownMenuItem onClick={() => onStatusChange?.(appointment.id, "confirmed")}>
                              Xác nhận
                            </DropdownMenuItem>
                          )}
                          {appointment.status === "confirmed" && (
                            <DropdownMenuItem onClick={() => onStatusChange?.(appointment.id, "completed")}>
                              Hoàn thành
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => onStatusChange?.(appointment.id, "cancelled")}
                            className="text-destructive"
                          >
                            Hủy lịch hẹn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete?.(appointment.id)} className="text-destructive">
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
