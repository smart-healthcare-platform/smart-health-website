"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Clock, User, MoreHorizontal, Search, Filter } from "lucide-react"
import { Appointment } from "@/types/appointment/appointment.type"
import { AppointmentStatus } from "@/types/appointment/index"


interface Props {
    appointments: Appointment[]
    loading?: boolean
}

export function AppointmentTable({ appointments, loading = false }: Props) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<Appointment["status"] | "all">("all")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7

    // Filter appointments
    const filtered = useMemo(() => {
        return appointments.filter((apt) => {
            const matchSearch =
                apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                apt.notes?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchStatus = statusFilter === "all" || apt.status === statusFilter

            return matchSearch && matchStatus
        })
    }, [appointments, searchTerm, statusFilter])

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const StatusBadge = (status: Appointment["status"]) => {
        const labels: Record<Appointment["status"], string> = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            IN_PROGRESS: "Đang khám",
            COMPLETED: "Hoàn thành",
            CANCELLED: "Đã hủy",
            NO_SHOW: "Không đến",
            CHECKED_IN: "Đã check-in",
        }
        return <Badge className="bg-green-100 text-green-700">{labels[status]}</Badge>
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                    Đang tải dữ liệu...
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Danh sách lịch hẹn</CardTitle>

                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10 w-64"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Lọc
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => { setStatusFilter("all"); setCurrentPage(1) }}>
                                    Tất cả
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setStatusFilter(AppointmentStatus.CONFIRMED); setCurrentPage(1) }}>
                                    Đã xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setStatusFilter(AppointmentStatus.PENDING); setCurrentPage(1) }}>
                                    Chờ xác nhận
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setStatusFilter(AppointmentStatus.COMPLETED); setCurrentPage(1) }}>
                                    Hoàn thành
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setStatusFilter(AppointmentStatus.CANCELLED); setCurrentPage(1) }}>
                                    Đã hủy
                                </DropdownMenuItem>
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

                                <TableHead>Bệnh nhân</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Loại</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ghi chú</TableHead>
                                <TableHead className="text-right w-[60px]">...</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {paginated.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                                        Không tìm thấy kết quả
                                    </TableCell>
                                </TableRow>
                            )}

                            {paginated.map((apt) => (
                                <TableRow key={apt.id}>
                                    {/* Bệnh nhân */}
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        {apt.patientName}
                                    </TableCell>

                                    {/* Thời gian */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">
                                                {new Date(apt.startAt).toLocaleTimeString("vi-VN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}{" "}
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                {new Date(apt.startAt).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge variant="outline">{apt.type}</Badge>
                                    </TableCell>

                                    <TableCell>{StatusBadge(apt.status)}</TableCell>

                                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                                        {apt.notes || "Không có ghi chú"}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            ))}

                        </TableBody>
                    </Table>
                </div>


            </CardContent>
        </Card>
    )
}
