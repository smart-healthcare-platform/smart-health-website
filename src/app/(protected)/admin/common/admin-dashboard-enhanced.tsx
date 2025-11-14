"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Activity,
  XCircle,
  AlertTriangle,
  AlertCircle,
  CalendarPlus,
  UserPlus,
  List,
  FileText,
  ClipboardCheck,
  Megaphone,
  ArrowUpRight,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Package,
  ShoppingCart,
  Heart,
  Sparkles,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"

// ============================================
// MOCK DATA
// ============================================

// Main KPI Stats
const kpiStats = [
  {
    title: "Total Patients",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active patients in system",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    breakdown: { new: 145, returning: 2702 },
  },
  {
    title: "Active Doctors",
    value: "124",
    change: "+2.1%",
    trend: "up",
    icon: UserCheck,
    description: "Currently available",
    color: "text-green-600",
    bgColor: "bg-green-50",
    breakdown: { onDuty: 45, available: 79, onLeave: 5 },
  },
  {
    title: "Today's Appointments",
    value: "18",
    change: "-5.2%",
    trend: "down",
    icon: Calendar,
    description: "Scheduled for today",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    breakdown: { pending: 3, confirmed: 8, inProgress: 2, completed: 4, cancelled: 1 },
  },
  {
    title: "Revenue Today",
    value: "₫45.6M",
    change: "+18.3%",
    trend: "up",
    icon: DollarSign,
    description: "vs yesterday",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    breakdown: { cash: "12M", momo: "18.5M", vnpay: "10.1M", insurance: "5M" },
  },
]

// Quick Stats
const quickStats = [
  {
    label: "Avg Wait Time",
    value: "12 min",
    icon: Clock,
    status: "good",
    color: "text-green-600",
  },
  {
    label: "Completed",
    value: "45",
    icon: CheckCircle,
    status: "good",
    color: "text-blue-600",
  },
  {
    label: "In Progress",
    value: "8",
    icon: Activity,
    status: "active",
    color: "text-purple-600",
    pulse: true,
  },
  {
    label: "Cancelled",
    value: "2",
    icon: XCircle,
    status: "warning",
    color: "text-red-600",
  },
  {
    label: "Unpaid Bills",
    value: "5",
    icon: AlertTriangle,
    status: "warning",
    color: "text-amber-600",
    badge: "₫8.2M",
  },
  {
    label: "Active Alerts",
    value: "3",
    icon: AlertCircle,
    status: "critical",
    color: "text-red-600",
    urgent: true,
  },
]

// Quick Actions
const quickActions = [
  {
    label: "New Appointment",
    icon: CalendarPlus,
    color: "bg-blue-600 hover:bg-blue-700",
    shortcut: "Ctrl+N",
  },
  {
    label: "Register Patient",
    icon: UserPlus,
    color: "bg-green-600 hover:bg-green-700",
    shortcut: "Ctrl+P",
  },
  {
    label: "View Queue",
    icon: List,
    color: "bg-purple-600 hover:bg-purple-700",
    badge: "8 waiting",
  },
  {
    label: "Generate Report",
    icon: FileText,
    color: "bg-amber-600 hover:bg-amber-700",
  },
  {
    label: "Check-in Patient",
    icon: ClipboardCheck,
    color: "bg-indigo-600 hover:bg-indigo-700",
  },
  {
    label: "Send Announcement",
    icon: Megaphone,
    color: "bg-pink-600 hover:bg-pink-700",
  },
]

// Appointment Distribution Data
const appointmentData = [
  { time: "08:00", appointments: 12, completed: 10 },
  { time: "10:00", appointments: 19, completed: 15 },
  { time: "12:00", appointments: 15, completed: 12 },
  { time: "14:00", appointments: 22, completed: 18 },
  { time: "16:00", appointments: 18, completed: 14 },
  { time: "18:00", appointments: 8, completed: 5 },
]

// Patient Growth Data
const patientGrowthData = [
  { month: "Jan", total: 2100, new: 120, returning: 1980 },
  { month: "Feb", total: 2250, new: 150, returning: 2100 },
  { month: "Mar", total: 2400, new: 180, returning: 2220 },
  { month: "Apr", total: 2580, new: 200, returning: 2380 },
  { month: "May", total: 2720, new: 165, returning: 2555 },
  { month: "Jun", total: 2847, new: 145, returning: 2702 },
]

// Revenue Distribution
const revenueData = [
  { method: "Cash", amount: 12000000, percentage: 26 },
  { method: "MoMo", amount: 18500000, percentage: 41 },
  { method: "VNPay", amount: 10170000, percentage: 22 },
  { method: "Insurance", amount: 5000000, percentage: 11 },
]

const COLORS = ["#10b981", "#a855f7", "#3b82f6", "#f59e0b"]

// Recent Appointments
const recentAppointments = [
  {
    id: "1",
    patient: "Nguyễn Văn A",
    patientId: "PAT-001",
    doctor: "BS. Trần Thị B",
    specialty: "Nội khoa",
    time: "09:30",
    status: "confirmed",
    type: "Khám tổng quát",
    payment: "paid",
  },
  {
    id: "2",
    patient: "Lê Thị C",
    patientId: "PAT-002",
    doctor: "BS. Phạm Văn D",
    specialty: "Ngoại khoa",
    time: "10:15",
    status: "pending",
    type: "Khám chuyên khoa",
    payment: "unpaid",
  },
  {
    id: "3",
    patient: "Hoàng Minh E",
    patientId: "PAT-003",
    doctor: "BS. Chu Thị F",
    specialty: "Tim mạch",
    time: "11:00",
    status: "completed",
    type: "Tái khám",
    payment: "paid",
  },
  {
    id: "4",
    patient: "Vũ Thị G",
    patientId: "PAT-004",
    doctor: "BS. Đỗ Văn H",
    specialty: "Nhi khoa",
    time: "14:30",
    status: "cancelled",
    type: "Khám tim mạch",
    payment: "refunded",
  },
  {
    id: "5",
    patient: "Trần Văn I",
    patientId: "PAT-005",
    doctor: "BS. Lê Thị K",
    specialty: "Da liễu",
    time: "15:00",
    status: "in-progress",
    type: "Khám da liễu",
    payment: "paid",
  },
]

// System Health Metrics
const systemMetrics = [
  { name: "Database", value: 85, status: "healthy", responseTime: "45ms" },
  { name: "API Response", value: 92, status: "healthy", responseTime: "120ms" },
  { name: "Storage", value: 67, status: "warning", used: "670GB", total: "1TB" },
  { name: "Memory Usage", value: 45, status: "healthy", used: "4.5GB", total: "10GB" },
  { name: "Auth Service", value: 98, status: "healthy", responseTime: "85ms" },
  { name: "Chat Service", value: 88, status: "healthy", responseTime: "95ms" },
]

// Alerts & Notifications
const alerts = [
  {
    id: "1",
    type: "stock",
    priority: "high",
    icon: Package,
    title: "Low Stock Warning",
    message: "Paracetamol 500mg (10 boxes left)",
    timestamp: "5 min ago",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "2",
    type: "approval",
    priority: "medium",
    icon: FileText,
    title: "Prescription Pending",
    message: "Dr. Nguyen's prescription needs review",
    timestamp: "15 min ago",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    id: "3",
    type: "schedule",
    priority: "low",
    icon: Calendar,
    title: "Schedule Conflict",
    message: "Dr. Lee has overlapping appointments",
    timestamp: "30 min ago",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
]

// Top Doctors
const topDoctors = [
  {
    rank: 1,
    name: "BS. Trần Thị B",
    specialty: "Nội khoa",
    appointments: 45,
    rating: 4.9,
  },
  {
    rank: 2,
    name: "BS. Phạm Văn D",
    specialty: "Ngoại khoa",
    appointments: 38,
    rating: 4.8,
  },
  {
    rank: 3,
    name: "BS. Chu Thị F",
    specialty: "Tim mạch",
    appointments: 35,
    rating: 4.7,
  },
]

// Department Performance
const departmentData = [
  { department: "Nội khoa", appointments: 120, revenue: 50 },
  { department: "Ngoại khoa", appointments: 85, revenue: 42 },
  { department: "Nhi khoa", appointments: 95, revenue: 38 },
  { department: "Tim mạch", appointments: 68, revenue: 55 },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
  }
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AdminDashboardEnhanced() {
  return (
    <div className="space-y-6 pb-8">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            Last updated: 2 min ago
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ========== KPI STATS CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs mt-2">
                <div
                  className={`flex items-center font-semibold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </div>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
              {/* Mini breakdown on hover */}
              <div className="mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(stat.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key}:</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========== QUICK STATS & QUICK ACTIONS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
            <CardDescription>Real-time metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    stat.urgent ? "border-red-300 bg-red-50" : "border-border"
                  }`}
                >
                  <div className={`relative ${stat.pulse ? "animate-pulse" : ""}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                    {stat.badge && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  className={`${action.color} text-white h-auto py-4 flex-col items-center justify-center space-y-2 relative group`}
                  variant="default"
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{action.label}</span>
                  {action.badge && (
                    <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                      {action.badge}
                    </Badge>
                  )}
                  {action.shortcut && (
                    <span className="text-xs opacity-0 group-hover:opacity-70 transition-opacity">
                      {action.shortcut}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== CHARTS ROW 1 ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Distribution Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Distribution throughout the day</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={appointmentData}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorAppointments)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  fillOpacity={0}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Growth Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Growth</CardTitle>
                <CardDescription>6-month registration trend</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="new"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="New"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ========== CHARTS ROW 2 ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Method</CardTitle>
            <CardDescription>Payment distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="amount"
                  label={(entry) => `${entry.percentage}%`}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4 w-full">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{item.method}</p>
                    <p className="text-sm font-semibold">{formatCurrency(item.amount)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Appointments & revenue by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="department" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="appointments" fill="#3b82f6" name="Appointments" />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (M)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ========== BOTTOM ROW ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Latest appointment activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All →
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-green-500"
                          : appointment.status === "pending"
                          ? "bg-amber-500"
                          : appointment.status === "completed"
                          ? "bg-blue-500"
                          : appointment.status === "in-progress"
                          ? "bg-purple-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold truncate">{appointment.patient}</p>
                        <Badge variant="outline" className="text-xs">
                          {appointment.patientId}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {appointment.doctor} • {appointment.specialty} • {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </Badge>
                    <Badge
                      variant={appointment.payment === "paid" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {appointment.payment}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground min-w-[60px] text-right">
                      {appointment.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{metric.value}%</span>
                      {metric.status === "healthy" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : metric.status === "warning" ? (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <Progress
                    value={metric.value}
                    className={`h-2 ${
                      metric.status === "healthy"
                        ? "[&>div]:bg-green-500"
                        : metric.status === "warning"
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-red-500"
                    }`}
                  />
                  {metric.responseTime && (
                    <p className="text-xs text-muted-foreground">⚡ {metric.responseTime}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== ALERTS & TOP DOCTORS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>Alerts & Notifications</span>
                  <Badge variant="destructive" className="text-xs">
                    {alerts.length}
                  </Badge>
                </CardTitle>
                <CardDescription>Requires your attention</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Mark All Read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${alert.bgColor} border-l-4 ${
                    alert.priority === "high"
                      ? "border-l-red-500"
                      : alert.priority === "medium"
                      ? "border-l-amber-500"
                      : "border-l-blue-500"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <alert.icon className={`h-5 w-5 ${alert.color} mt-0.5`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{alert.title}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            alert.priority === "high"
                              ? "border-red-300 text-red-700"
                              : alert.priority === "medium"
                              ? "border-amber-300 text-amber-700"
                              : "border-blue-300 text-blue-700"
                          }`}
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="default" className="text-xs h-7">
                      Take Action
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7">
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Top Performing Doctors</span>
            </CardTitle>
            <CardDescription>This month's leaders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDoctors.map((doctor) => (
                <div
                  key={doctor.rank}
                  className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                      doctor.rank === 1
                        ? "bg-amber-500"
                        : doctor.rank === 2
                        ? "bg-gray-400"
                        : "bg-orange-700"
                    }`}
                  >
                    #{doctor.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{doctor.appointments}</p>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                      <span className="text-xs font-semibold">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full">
              View All Doctors →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}