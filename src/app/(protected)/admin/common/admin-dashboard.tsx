"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserCheck,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const statsData = [
  {
    title: "Total Patients",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active patients in system",
  },
  {
    title: "Active Doctors",
    value: "124",
    change: "+2.1%",
    trend: "up",
    icon: UserCheck,
    description: "Currently available doctors",
  },
  {
    title: "Today's Appointments",
    value: "18",
    change: "-5.2%",
    trend: "down",
    icon: Calendar,
    description: "Scheduled for today",
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "+0.1%",
    trend: "up",
    icon: Activity,
    description: "Uptime this month",
  },
]

const appointmentData = [
  { time: "08:00", appointments: 12 },
  { time: "10:00", appointments: 19 },
  { time: "12:00", appointments: 15 },
  { time: "14:00", appointments: 22 },
  { time: "16:00", appointments: 18 },
  { time: "18:00", appointments: 8 },
]

const patientGrowthData = [
  { month: "Jan", patients: 2100 },
  { month: "Feb", patients: 2250 },
  { month: "Mar", patients: 2400 },
  { month: "Apr", patients: 2580 },
  { month: "May", patients: 2720 },
  { month: "Jun", patients: 2847 },
]

const recentAppointments = [
  {
    id: "1",
    patient: "Nguyễn Văn A",
    doctor: "BS. Trần Thị B",
    time: "09:30",
    status: "confirmed",
    type: "Khám tổng quát",
  },
  {
    id: "2",
    patient: "Lê Thị C",
    doctor: "BS. Phạm Văn D",
    time: "10:15",
    status: "pending",
    type: "Khám chuyên khoa",
  },
  {
    id: "3",
    patient: "Hoàng Minh E",
    doctor: "BS. Chu Thị F",
    time: "11:00",
    status: "completed",
    type: "Tái khám",
  },
  {
    id: "4",
    patient: "Vũ Thị G",
    doctor: "BS. Đỗ Văn H",
    time: "14:30",
    status: "cancelled",
    type: "Khám tim mạch",
  },
]

const systemMetrics = [
  { name: "Database", value: 85, status: "healthy" },
  { name: "API Response", value: 92, status: "healthy" },
  { name: "Storage", value: 67, status: "warning" },
  { name: "Memory Usage", value: 45, status: "healthy" },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Last updated: 2 min ago
          </Badge>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`flex items-center ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </div>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today's Appointments
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Appointment distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Patient Growth
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Monthly patient registration trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Latest appointment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-success"
                          : appointment.status === "pending"
                            ? "bg-warning"
                            : appointment.status === "completed"
                              ? "bg-primary"
                              : "bg-destructive"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{appointment.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.doctor} • {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : appointment.status === "pending"
                            ? "secondary"
                            : appointment.status === "completed"
                              ? "outline"
                              : "destructive"
                      }
                      className="text-xs"
                    >
                      {appointment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>Real-time system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{metric.value}%</span>
                      {metric.status === "healthy" ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : metric.status === "warning" ? (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={metric.value}
                    className={`h-2 ${
                      metric.status === "healthy"
                        ? "[&>div]:bg-success"
                        : metric.status === "warning"
                          ? "[&>div]:bg-warning"
                          : "[&>div]:bg-destructive"
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
