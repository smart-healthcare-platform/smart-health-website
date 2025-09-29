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
  Users,
  UserPlus,
  UserCheck,
  Clock,
} from "lucide-react"

const patientsData = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    age: 35,
    gender: "Nam",
    status: "active",
    lastVisit: "2024-01-15",
    totalVisits: 12,
    condition: "Khỏe mạnh",
    avatar: "/avatars/patient1.png",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0912345678",
    age: 42,
    gender: "Nữ",
    status: "inactive",
    lastVisit: "2023-12-20",
    totalVisits: 8,
    condition: "Cao huyết áp",
    avatar: "/avatars/patient2.png",
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    email: "leminhcuong@email.com",
    phone: "0923456789",
    age: 28,
    gender: "Nam",
    status: "active",
    lastVisit: "2024-01-18",
    totalVisits: 5,
    condition: "Đái tháo đường",
    avatar: "/avatars/patient3.png",
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "phamthidung@email.com",
    phone: "0934567890",
    age: 55,
    gender: "Nữ",
    status: "pending",
    lastVisit: "2024-01-10",
    totalVisits: 15,
    condition: "Tim mạch",
    avatar: "/avatars/patient4.png",
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    email: "hoangvanem@email.com",
    phone: "0945678901",
    age: 67,
    gender: "Nam",
    status: "active",
    lastVisit: "2024-01-20",
    totalVisits: 23,
    condition: "Khớp xương",
    avatar: "/avatars/patient5.png",
  },
]

const statsData = [
  {
    title: "Total Patients",
    value: "2,847",
    icon: Users,
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "New This Month",
    value: "156",
    icon: UserPlus,
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Active Patients",
    value: "2,341",
    icon: UserCheck,
    change: "+5.1%",
    trend: "up",
  },
  {
    title: "Pending Review",
    value: "23",
    icon: Clock,
    change: "-2.3%",
    trend: "down",
  },
]

export function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")

  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter

    return matchesSearch && matchesStatus && matchesGender
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">Manage and monitor all patient records</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
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
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>A comprehensive list of all patients in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gender</SelectItem>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Patient Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {patient.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{patient.email}</div>
                        <div className="text-muted-foreground">{patient.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{patient.age} tuổi</div>
                        <div className="text-muted-foreground">{patient.gender}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          patient.status === "active"
                            ? "default"
                            : patient.status === "inactive"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(patient.lastVisit).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {patient.totalVisits}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{patient.condition}</TableCell>
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
                            Edit Patient
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Patient
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
              Showing {filteredPatients.length} of {patientsData.length} patients
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
