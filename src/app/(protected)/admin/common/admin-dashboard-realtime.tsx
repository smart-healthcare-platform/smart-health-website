"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  RefreshCw,
  Loader2,
  Stethoscope,
  CreditCard,
} from "lucide-react"
import { 
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
  Tooltip, 
  Legend 
} from "recharts"
import {
  useDashboardStats,
  useAppointmentTrends,
  useRecentAppointments,
  usePatientGrowth,
  usePatientDemographics,
  useRecentPatients,
  useSystemHealth,
  useRefreshDashboard,
  useRefetchDashboard,
} from "@/hooks/useAdminDashboard"
import { DoctorAnalytics } from "./doctor-analytics"
import { RevenueAnalytics } from "./revenue-analytics"
import { format } from "date-fns"

const CHART_COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#a855f7",
  pink: "#ec4899",
}

const PIE_COLORS = ["#10b981", "#a855f7", "#3b82f6", "#f59e0b", "#ef4444"]

export default function AdminDashboardRealtime() {
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch all dashboard data
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: appointmentTrends, isLoading: trendsLoading } = useAppointmentTrends('daily', 30)
  const { data: recentAppointments, isLoading: recentApptsLoading } = useRecentAppointments(1, 5)
  const { data: patientGrowth, isLoading: growthLoading } = usePatientGrowth('daily', 30)
  const { data: patientDemographics, isLoading: demographicsLoading } = usePatientDemographics()
  const distributionLoading = false // Status pie chart uses local stats data
  const { data: recentPatients, isLoading: recentPatientsLoading } = useRecentPatients(1, 5)
  const { data: systemHealth, isLoading: healthLoading } = useSystemHealth()

  const refreshDashboard = useRefreshDashboard()
  const refetch = useRefetchDashboard()

  const handleRefresh = () => {
    refetch()
  }

  // Loading state
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Lỗi tải dữ liệu</p>
          <p className="text-gray-600 mb-4">{(statsError as Error).message}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  // KPI Cards Data
  const kpiCards = [
    {
      title: "Tổng bệnh nhân",
      value: stats?.totalPatients || 0,
      change: stats?.patientGrowthRate || 0,
      trend: (stats?.patientGrowthRate || 0) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Bệnh nhân hoạt động",
    },
    {
      title: "Bác sĩ hoạt động",
      value: stats?.activeDoctors || 0,
      total: stats?.totalDoctors || 0,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${stats?.onlineDoctors || 0} đang online`,
    },
    {
      title: "Lịch hẹn hôm nay",
      value: stats?.scheduledToday || 0,
      total: stats?.totalAppointments || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Đã xếp lịch",
    },
    {
      title: "Doanh thu tháng này",
      value: stats?.revenueThisMonth || 0,
      change: stats?.totalRevenue || 0,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Tổng doanh thu",
      isCurrency: true,
    },
  ]

  // Quick stats
  const quickStats = [
    {
      label: "Chờ xác nhận",
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Đã hoàn thành",
      value: stats?.completedAppointments || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Đã xác nhận",
      value: stats?.confirmedAppointments || 0,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      label: "Đã hủy",
      value: stats?.cancelledAppointments || 0,
      icon: XCircle,
      color: "text-red-600",
    },
  ]

  // Prepare chart data
  const appointmentChartData = appointmentTrends?.data?.map(d => ({
    date: format(new Date(d.date), 'dd/MM'),
    appointments: d.count,
    completed: d.completed,
    cancelled: d.cancelled,
  })) || []

  const patientChartData = patientGrowth?.data?.map(d => ({
    date: format(new Date(d.date), 'dd/MM'),
    total: d.cumulative,
    new: d.count,
  })) || []

  const statusPieData = [
    { name: 'Đã xác nhận', value: stats?.confirmedAppointments || 0, color: CHART_COLORS.primary },
    { name: 'Chờ xác nhận', value: stats?.pendingAppointments || 0, color: CHART_COLORS.warning },
    { name: 'Hoàn thành', value: stats?.completedAppointments || 0, color: CHART_COLORS.success },
    { name: 'Đã hủy', value: stats?.cancelledAppointments || 0, color: CHART_COLORS.danger },
  ].filter(item => item.value > 0)

  const demographicsPieData = patientDemographics?.genders?.map((g, idx) => ({
    name: g.gender === 'male' ? 'Nam' : g.gender === 'female' ? 'Nữ' : 'Khác',
    value: g.count,
    color: PIE_COLORS[idx % PIE_COLORS.length],
  })) || []

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
          <p className="text-gray-600 mt-1">
            Tổng quan hệ thống - Cập nhật lúc {stats?.timestamp ? format(new Date(stats.timestamp), 'HH:mm:ss dd/MM/yyyy') : ''}
          </p>
          {stats?.fromCache && (
            <Badge variant="outline" className="mt-2">
              <Activity className="h-3 w-3 mr-1" />
              Từ cache ({stats?.responseTime}ms)
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            disabled={refreshDashboard.isPending}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshDashboard.isPending ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Bác sĩ
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Doanh thu
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon
              const isPositive = kpi.trend === "up"
              
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {kpi.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {kpi.isCurrency ? formatCurrency(kpi.value) : kpi.value.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-600">
                        {kpi.description}
                      </p>
                      {kpi.change !== undefined && kpi.trend && (
                        <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(kpi.change).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    {kpi.total && (
                      <div className="mt-2 text-xs text-gray-500">
                        Tổng: {kpi.total.toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái lịch hẹn</CardTitle>
              <CardDescription>Phân bố theo trạng thái</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                      <div>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng lịch hẹn (30 ngày)</CardTitle>
                <CardDescription>Thống kê lịch hẹn theo ngày</CardDescription>
              </CardHeader>
              <CardContent>
                {trendsLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={appointmentChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        style={{ fontSize: '12px' }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        style={{ fontSize: '12px' }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="appointments" 
                        stackId="1"
                        stroke={CHART_COLORS.primary} 
                        fill={CHART_COLORS.primary}
                        fillOpacity={0.6}
                        name="Tổng lịch hẹn"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        stackId="2"
                        stroke={CHART_COLORS.success} 
                        fill={CHART_COLORS.success}
                        fillOpacity={0.4}
                        name="Đã hoàn thành"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Patient Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng bệnh nhân (30 ngày)</CardTitle>
                <CardDescription>Bệnh nhân mới đăng ký</CardDescription>
              </CardHeader>
              <CardContent>
                {growthLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        style={{ fontSize: '12px' }}
                        stroke="#6b7280"
                      />
                      <YAxis 
                        style={{ fontSize: '12px' }}
                        stroke="#6b7280"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke={CHART_COLORS.primary}
                        strokeWidth={3}
                        dot={{ fill: CHART_COLORS.primary, r: 4 }}
                        name="Tổng bệnh nhân"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="new" 
                        stroke={CHART_COLORS.success}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Bệnh nhân mới"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố trạng thái lịch hẹn</CardTitle>
                <CardDescription>Tổng: {stats?.totalAppointments?.toLocaleString() || 0} lịch hẹn</CardDescription>
              </CardHeader>
              <CardContent>
                {distributionLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusPieData.map((entry: { name: string; value: number; color: string }, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">Tỷ lệ hoàn thành</p>
                    <p className="text-lg font-bold text-green-600">
                      {(stats?.completionRate || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-xs text-gray-600">Tỷ lệ hủy</p>
                    <p className="text-lg font-bold text-red-600">
                      {(stats?.cancellationRate || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Patient Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Nhân khẩu học bệnh nhân</CardTitle>
                <CardDescription>Phân bố theo giới tính</CardDescription>
              </CardHeader>
              <CardContent>
                {demographicsLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={demographicsPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {demographicsPieData.map((entry: { name: string; value: number; color: string }, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-600">Tuổi trung bình</p>
                        <p className="text-lg font-bold text-blue-600">
                          {patientDemographics?.averageAge?.toFixed(1) || 0} tuổi
                        </p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded">
                        <p className="text-xs text-gray-600">Tuổi trung vị</p>
                        <p className="text-lg font-bold text-purple-600">
                          {patientDemographics?.medianAge || 0} tuổi
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn gần đây</CardTitle>
                <CardDescription>5 lịch hẹn mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                {recentApptsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : recentAppointments?.appointments && recentAppointments.appointments.length > 0 ? (
                  <div className="space-y-3">
                    {recentAppointments.appointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{apt.patientName}</p>
                          <p className="text-xs text-gray-600">
                            BS. {apt.doctorName} • {apt.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              apt.status === 'confirmed' ? 'default' :
                              apt.status === 'pending' ? 'secondary' :
                              apt.status === 'completed' ? 'outline' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {apt.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(apt.startAt), 'dd/MM HH:mm')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Không có lịch hẹn nào</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle>Bệnh nhân mới</CardTitle>
                <CardDescription>5 bệnh nhân đăng ký gần đây</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPatientsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : recentPatients?.patients && recentPatients.patients.length > 0 ? (
                  <div className="space-y-3">
                    {recentPatients.patients.map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{patient.full_name}</p>
                          <p className="text-xs text-gray-600">
                            {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'} • 
                            {format(new Date(patient.date_of_birth), ' dd/MM/yyyy')}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(patient.created_at), 'dd/MM/yyyy')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Không có bệnh nhân mới</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Tình trạng hệ thống</CardTitle>
              <CardDescription>Trạng thái các dịch vụ</CardDescription>
            </CardHeader>
            <CardContent>
              {healthLoading ? (
                <div className="h-32 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tổng quan</span>
                      <Badge variant={
                        systemHealth?.overall === 'healthy' ? 'default' :
                        systemHealth?.overall === 'degraded' ? 'secondary' : 'destructive'
                      }>
                        {systemHealth?.overall === 'healthy' ? 'Tốt' :
                         systemHealth?.overall === 'degraded' ? 'Xuống cấp' : 'Lỗi'}
                      </Badge>
                    </div>
                    <Progress 
                      value={systemHealth?.healthPercentage || 0} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {systemHealth?.healthyCount}/{systemHealth?.totalCount} dịch vụ hoạt động tốt
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {systemHealth?.services?.map((service, idx) => (
                      <div key={idx} className="p-3 border rounded-lg text-center">
                        <div className="flex items-center justify-center mb-2">
                          {service.status === 'healthy' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : service.status === 'degraded' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <p className="text-xs font-medium truncate">{service.name}</p>
                        {service.responseTime && (
                          <p className="text-xs text-gray-500">{service.responseTime}ms</p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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