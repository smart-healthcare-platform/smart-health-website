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
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  UserCheck,
  UserPlus,
  Clock,
  Star,
  Calendar,
  Users,
} from "lucide-react"

const doctorsData = [
  {
    id: "1",
    name: "BS. Nguyễn Văn Hùng",
    email: "nguyenvanhung@smarthealth.com",
    phone: "0901234567",
    specialization: "Tim mạch",
    department: "Khoa Tim mạch",
    experience: 15,
    status: "active",
    rating: 4.8,
    totalPatients: 245,
    todayAppointments: 8,
    avatar: "/avatars/doctor1.png",
    license: "BYT-12345",
  },
  {
    id: "2",
    name: "BS. Trần Thị Mai",
    email: "tranthimai@smarthealth.com",
    phone: "0912345678",
    specialization: "Nhi khoa",
    department: "Khoa Nhi",
    experience: 12,
    status: "active",
    rating: 4.9,
    totalPatients: 189,
    todayAppointments: 6,
    avatar: "/avatars/doctor2.png",
    license: "BYT-12346",
  },
  {
    id: "3",
    name: "BS. Lê Minh Tuấn",
    email: "leminhtuan@smarthealth.com",
    phone: "0923456789",
    specialization: "Thần kinh",
    department: "Khoa Thần kinh",
    experience: 8,
    status: "inactive",
    rating: 4.6,
    totalPatients: 156,
    todayAppointments: 0,
    avatar: "/avatars/doctor3.png",
    license: "BYT-12347",
  },
  {
    id: "4",
    name: "BS. Phạm Thị Lan",
    email: "phamthilan@smarthealth.com",
    phone: "0934567890",
    specialization: "Da liễu",
    department: "Khoa Da liễu",
    experience: 10,
    status: "active",
    rating: 4.7,
    totalPatients: 203,
    todayAppointments: 5,
    avatar: "/avatars/doctor4.png",
    license: "BYT-12348",
  },
  {
    id: "5",
    name: "BS. Hoàng Văn Đức",
    email: "hoangvanduc@smarthealth.com",
    phone: "0945678901",
    specialization: "Chấn thương chỉnh hình",
    department: "Khoa Chấn thương",
    experience: 20,
    status: "active",
    rating: 4.9,
    totalPatients: 312,
    todayAppointments: 12,
    avatar: "/avatars/doctor5.png",
    license: "BYT-12349",
  },
]

const statsData = [
  {
    title: "Total Doctors",
    value: "124",
    icon: UserCheck,
    change: "+2.1%",
    trend: "up",
  },
  {
    title: "Active Today",
    value: "89",
    icon: Users,
    change: "+5.3%",
    trend: "up",
  },
  {
    title: "New This Month",
    value: "8",
    icon: UserPlus,
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "On Leave",
    value: "12",
    icon: Clock,
    change: "-1.2%",
    trend: "down",
  },
]

export function DoctorManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || doctor.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || doctor.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = [...new Set(doctorsData.map((doctor) => doctor.department))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
          <p className="text-muted-foreground">Manage medical staff and their schedules</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
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

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Staff Directory</CardTitle>
          <CardDescription>Comprehensive list of all doctors and medical professionals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Doctor Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Today</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")
                              .slice(-2)
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">{doctor.department}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{doctor.email}</div>
                        <div className="text-muted-foreground">{doctor.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{doctor.specialization}</div>
                        <div className="text-muted-foreground">License: {doctor.license}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{doctor.experience} years</div>
                        <div className="text-muted-foreground">{doctor.totalPatients} patients</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doctor.status === "active" ? "default" : "secondary"}>{doctor.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doctor.todayAppointments}</span>
                      </div>
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
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Doctor
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove Doctor
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
              Showing {filteredDoctors.length} of {doctorsData.length} doctors
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
    </div>
  )
}
