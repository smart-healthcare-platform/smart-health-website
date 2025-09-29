"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarDays,
  CalendarCheck,
  CalendarX,
} from "lucide-react"

const appointmentsData = [
  {
    id: "1",
    patient: "Nguyễn Văn An",
    doctor: "BS. Nguyễn Văn Hùng",
    date: "2024-01-22",
    time: "09:00",
    duration: 30,
    type: "Khám tổng quát",
    status: "confirmed",
    notes: "Khám định kỳ",
    patientPhone: "0901234567",
    doctorSpecialty: "Tim mạch",
  },
  {
    id: "2",
    patient: "Trần Thị Bình",
    doctor: "BS. Trần Thị Mai",
    date: "2024-01-22",
    time: "10:30",
    duration: 45,
    type: "Khám chuyên khoa",
    status: "pending",
    notes: "Tái khám sau điều trị",
    patientPhone: "0912345678",
    doctorSpecialty: "Nhi khoa",
  },
  {
    id: "3",
    patient: "Lê Minh Cường",
    doctor: "BS. Lê Minh Tuấn",
    date: "2024-01-22",
    time: "14:00",
    duration: 60,
    type: "Tư vấn",
    status: "completed",
    notes: "Hoàn thành khám",
    patientPhone: "0923456789",
    doctorSpecialty: "Thần kinh",
  },
  {
    id: "4",
    patient: "Phạm Thị Dung",
    doctor: "BS. Phạm Thị Lan",
    date: "2024-01-22",
    time: "15:30",
    duration: 30,
    type: "Khám da liễu",
    status: "cancelled",
    notes: "Bệnh nhân hủy",
    patientPhone: "0934567890",
    doctorSpecialty: "Da liễu",
  },
  {
    id: "5",
    patient: "Hoàng Văn Em",
    doctor: "BS. Hoàng Văn Đức",
    date: "2024-01-23",
    time: "08:30",
    duration: 45,
    type: "Khám chấn thương",
    status: "confirmed",
    notes: "Khám lần đầu",
    patientPhone: "0945678901",
    doctorSpecialty: "Chấn thương chỉnh hình",
  },
]

const statsData = [
  {
    title: "Total Appointments",
    value: "1,247",
    icon: Calendar,
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Today's Schedule",
    value: "18",
    icon: CalendarDays,
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Completed",
    value: "892",
    icon: CalendarCheck,
    change: "+5.1%",
    trend: "up",
  },
  {
    title: "Cancelled",
    value: "45",
    icon: CalendarX,
    change: "-2.3%",
    trend: "down",
  },
]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export function AppointmentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const [selectedDate, setSelectedDate] = useState("2024-01-22")

  const filteredAppointments = appointmentsData.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && appointment.date === selectedDate) ||
      (dateFilter === "tomorrow" && appointment.date === "2024-01-23") ||
      (dateFilter === "week" && new Date(appointment.date) >= new Date("2024-01-22"))

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-warning" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default">{status}</Badge>
      case "completed":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            {status}
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">{status}</Badge>
      case "cancelled":
        return <Badge variant="destructive">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
          <p className="text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>{stat.change}</span> from
                last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Appointment List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Schedule</CardTitle>
              <CardDescription>Manage all patient appointments and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-4 mb-6">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* Appointments Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt={appointment.patient} />
                              <AvatarFallback>
                                {appointment.patient
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{appointment.patient}</div>
                              <div className="text-sm text-muted-foreground">{appointment.patientPhone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{appointment.doctor}</div>
                            <div className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{new Date(appointment.date).toLocaleDateString("vi-VN")}</div>
                            <div className="text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {appointment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(appointment.status)}
                            {getStatusBadge(appointment.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{appointment.duration} min</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                          {appointment.notes}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Appointment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark Complete
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Appointment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredAppointments.length} of {appointmentsData.length} appointments
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Schedule - {new Date(selectedDate).toLocaleDateString("vi-VN")}</CardTitle>
              <CardDescription>Visual calendar view of today's appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Time Slots */}
                <div className="lg:col-span-3 space-y-2">
                  {timeSlots.map((time) => {
                    const appointment = appointmentsData.find((apt) => apt.time === time && apt.date === selectedDate)
                    return (
                      <div key={time} className="flex items-center space-x-4 p-3 border rounded-lg">
                        <div className="w-16 text-sm font-medium text-muted-foreground">{time}</div>
                        {appointment ? (
                          <div className="flex-1 flex items-center justify-between p-3 bg-card border rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(appointment.status)}
                              <div>
                                <div className="font-medium">{appointment.patient}</div>
                                <div className="text-sm text-muted-foreground">
                                  {appointment.doctor} • {appointment.type}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(appointment.status)}
                              <span className="text-sm text-muted-foreground">{appointment.duration}min</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 p-3 border-2 border-dashed border-muted rounded-lg text-center text-muted-foreground">
                            Available
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total</span>
                        <span className="font-medium">18</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-success">Confirmed</span>
                        <span className="font-medium">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warning">Pending</span>
                        <span className="font-medium">4</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-destructive">Cancelled</span>
                        <span className="font-medium">2</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
