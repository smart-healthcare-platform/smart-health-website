"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { Download, TrendingUp, TrendingDown, Users, UserCheck, Calendar, DollarSign, Clock } from "lucide-react"

const monthlyRevenueData = [
  { month: "Jan", revenue: 45000, appointments: 320, patients: 280 },
  { month: "Feb", revenue: 52000, appointments: 380, patients: 310 },
  { month: "Mar", revenue: 48000, appointments: 350, patients: 295 },
  { month: "Apr", revenue: 61000, appointments: 420, patients: 340 },
  { month: "May", revenue: 55000, appointments: 390, patients: 325 },
  { month: "Jun", revenue: 67000, appointments: 450, patients: 380 },
]

const departmentData = [
  { name: "Tim mạch", patients: 450, revenue: 180000, color: "#3b82f6" },
  { name: "Nhi khoa", patients: 380, revenue: 152000, color: "#10b981" },
  { name: "Thần kinh", patients: 320, revenue: 128000, color: "#f59e0b" },
  { name: "Da liễu", patients: 280, revenue: 112000, color: "#ef4444" },
  { name: "Chấn thương", patients: 420, revenue: 168000, color: "#8b5cf6" },
]

const appointmentStatusData = [
  { name: "Completed", value: 892, color: "#10b981" },
  { name: "Confirmed", value: 234, color: "#3b82f6" },
  { name: "Pending", value: 76, color: "#f59e0b" },
  { name: "Cancelled", value: 45, color: "#ef4444" },
]

const doctorPerformanceData = [
  { name: "BS. Nguyễn Văn Hùng", patients: 245, rating: 4.8, revenue: 98000 },
  { name: "BS. Trần Thị Mai", patients: 189, rating: 4.9, revenue: 75600 },
  { name: "BS. Lê Minh Tuấn", patients: 156, rating: 4.6, revenue: 62400 },
  { name: "BS. Phạm Thị Lan", patients: 203, rating: 4.7, revenue: 81200 },
  { name: "BS. Hoàng Văn Đức", patients: 312, rating: 4.9, revenue: 124800 },
]

const kpiData = [
  {
    title: "Total Revenue",
    value: "₫2,847,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "Monthly revenue",
  },
  {
    title: "Patient Satisfaction",
    value: "4.8/5.0",
    change: "+0.2",
    trend: "up",
    icon: Users,
    description: "Average rating",
  },
  {
    title: "Appointment Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: Calendar,
    description: "Completion rate",
  },
  {
    title: "Average Wait Time",
    value: "12 min",
    change: "-3 min",
    trend: "up",
    icon: Clock,
    description: "Patient wait time",
  },
]

export function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [reportType, setReportType] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`flex items-center ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {kpi.change}
                </div>
                <span className="text-muted-foreground">from last period</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operational">Operational</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and appointment volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Appointment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status Distribution</CardTitle>
                <CardDescription>Current appointment status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {appointmentStatusData.map((entry: { name: string; value: number; color: string }, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Patient volume and revenue by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Detailed financial performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>By department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dept.name}</span>
                      <span className="text-sm text-muted-foreground">₫{dept.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(dept.revenue / 180000) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Flow</CardTitle>
                <CardDescription>Monthly patient registration and appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="appointments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="patients" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Metrics</CardTitle>
                <CardDescription>Key operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bed Occupancy Rate</span>
                    <span className="text-sm text-muted-foreground">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Staff Utilization</span>
                    <span className="text-sm text-muted-foreground">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Equipment Usage</span>
                    <span className="text-sm text-muted-foreground">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <span className="text-sm text-muted-foreground">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Performance</CardTitle>
              <CardDescription>Individual doctor metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctorPerformanceData.map((doctor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">{doctor.patients} patients</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{doctor.rating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">₫{doctor.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Top Performer
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
