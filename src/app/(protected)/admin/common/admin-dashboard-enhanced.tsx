"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  Download,
  Stethoscope,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import {
  useDashboardStats,
  useAppointmentTrends,
  usePatientGrowth,
  useSystemHealth,
  useRefreshDashboard,
} from "@/hooks/useAdminDashboard"
import { DoctorAnalytics } from "./doctor-analytics"
import { RevenueAnalytics } from "./revenue-analytics"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

export function AdminDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState("overview")
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats()
  const { data: appointmentTrends, isLoading: trendsLoading } = useAppointmentTrends('daily', 7)
  const { data: patientGrowth, isLoading: growthLoading } = usePatientGrowth('daily', 7)
  const { data: systemHealth, isLoading: healthLoading } = useSystemHealth()
  const refreshMutation = useRefreshDashboard()

  const handleRefresh = async () => {
    await refreshMutation.mutateAsync()
    refetchStats()
  }

  if (statsLoading) {
    return <DashboardSkeleton />
  }

  const overviewStats = [
    {
      title: "Total Patients",
      value: stats?.totalPatients?.toLocaleString() || "0",
      change: `+${stats?.newPatientsThisMonth || 0} this month`,
      trend: stats?.patientGrowthRate || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments?.toLocaleString() || "0",
      change: `${stats?.scheduledToday || 0} scheduled today`,
      trend: stats?.completionRate || 0,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Active Doctors",
      value: stats?.activeDoctors?.toLocaleString() || "0",
      change: `${stats?.onlineDoctors || 0} online now`,
      trend: 0,
      icon: Stethoscope,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(stats?.totalRevenue || 0),
      change: `${new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(stats?.revenueThisMonth || 0)} this month`,
      trend: 0,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ]

  const appointmentData = appointmentTrends?.data?.map((d) => ({
    time: new Date(d.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    appointments: d.count,
    completed: d.completed,
    cancelled: d.cancelled,
  })) || []

  const patientData = patientGrowth?.data?.map((d) => ({
    time: new Date(d.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    patients: d.cumulative,
    newPatients: d.count,
  })) || []

  const appointmentStatusData = [
    {
      status: "Confirmed",
      count: stats?.confirmedAppointments || 0,
      color: "bg-blue-500",
      icon: CheckCircle,
      iconColor: "text-blue-500",
    },
    {
      status: "Pending",
      count: stats?.pendingAppointments || 0,
      color: "bg-yellow-500",
      icon: Clock,
      iconColor: "text-yellow-500",
    },
    {
      status: "Completed",
      count: stats?.completedAppointments || 0,
      color: "bg-green-500",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    {
      status: "Cancelled",
      count: stats?.cancelledAppointments || 0,
      color: "bg-red-500",
      icon: XCircle,
      iconColor: "text-red-500",
    },
  ]

  const serviceHealthItems = systemHealth?.services || []
  const healthyServices = serviceHealthItems.filter(s => s.status === 'healthy').length
  const totalServices = serviceHealthItems.length
  const healthPercentage = totalServices > 0 ? (healthyServices / totalServices) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here&apos;s your system overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {stats?.fromCache && (
            <Badge variant="outline" className="text-xs">
              Cached • Updated {new Date(stats.timestamp).toLocaleTimeString()}
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshMutation.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewStats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  {stat.trend > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-success mt-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.trend.toFixed(1)}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends (7 Days)</CardTitle>
                <CardDescription>Daily appointment activity and completion</CardDescription>
              </CardHeader>
              <CardContent>
                {trendsLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : appointmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={appointmentData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="appointments"
                        stackId="1"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stackId="2"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success))"
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No appointment data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patient Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth (7 Days)</CardTitle>
                <CardDescription>New patient registrations and cumulative total</CardDescription>
              </CardHeader>
              <CardContent>
                {growthLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : patientData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        name="Total Patients"
                      />
                      <Line
                        type="monotone"
                        dataKey="newPatients"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 3 }}
                        name="New Patients"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No patient data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointment Status */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Appointment Status Breakdown</CardTitle>
                <CardDescription>Current status distribution of all appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentStatusData.map((item) => {
                    const percentage = stats?.totalAppointments 
                      ? (item.count / stats.totalAppointments) * 100 
                      : 0
                    return (
                      <div key={item.status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                            <span className="text-sm font-medium">{item.status}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {item.count.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={percentage}
                          className={`h-2 [&>div]:${item.color}`}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                    <p className="text-lg font-bold text-success">
                      {(stats?.completionRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Cancellation Rate</p>
                    <p className="text-lg font-bold text-destructive">
                      {(stats?.cancellationRate || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Microservices status</CardDescription>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Health</span>
                        <span className="text-2xl font-bold">
                          {healthPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress
                        value={healthPercentage}
                        className={`h-3 ${
                          healthPercentage >= 90
                            ? "[&>div]:bg-success"
                            : healthPercentage >= 70
                            ? "[&>div]:bg-warning"
                            : "[&>div]:bg-destructive"
                        }`}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {healthyServices} of {totalServices} services healthy
                      </p>
                    </div>
                    <div className="space-y-2">
                      {serviceHealthItems.slice(0, 5).map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg border border-border"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                service.status === "healthy"
                                  ? "bg-success"
                                  : service.status === "degraded"
                                  ? "bg-warning"
                                  : "bg-destructive"
                              }`}
                            />
                            <span className="text-xs font-medium">{service.name}</span>
                          </div>
                          {service.status === "healthy" ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : service.status === "degraded" ? (
                            <AlertCircle className="h-3 w-3 text-warning" />
                          ) : (
                            <XCircle className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors">
          <DoctorAnalytics />
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue">
          <RevenueAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}