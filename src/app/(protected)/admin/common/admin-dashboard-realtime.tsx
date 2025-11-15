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
  RefreshCw,
  Loader2,
  Heart,
  Package,
  FileText,
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
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
  useAppointmentDistribution,
  useRecentAppointments,
  usePatientGrowth,
  usePatientDemographics,
  useRecentPatients,
  useSystemHealth,
  useRefreshDashboard,
  useRefetchDashboard,
} from "@/hooks/useAdminDashboard"
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
  // Fetch all dashboard data
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: appointmentTrends, isLoading: trendsLoading } = useAppointmentTrends('daily', 30)
  const { data: appointmentDistribution, isLoading: distributionLoading } = useAppointmentDistribution()
  const { data: recentAppointments, isLoading: recentApptsLoading } = useRecentAppointments(1, 5)
  const { data: patientGrowth, isLoading: growthLoading } = usePatientGrowth('daily', 30)
  const { data: patientDemographics, isLoading: demographicsLoading } = usePatientDemographics()
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
      description: "Đang khả dụng",
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
      title: "Doanh thu hôm nay",
      value: stats?.revenueToday || 0,
      change: stats?.revenueThisMonth || 0,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Tháng này",
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
                  {kpi.change !== undefined && (
                    <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(kpi.change).toFixed(1)}%
                    </div>
                  )}
                  {kpi.total !== undefined && (
                    <span className="text-xs text-gray-500">
                      / {kpi.total}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Xu hướng lịch hẹn (30 ngày)</CardTitle>
            <CardDescription>
              {trendsLoading ? (
                <span className="flex items-center text-sm">
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Đang tải...
                </span>
              ) : (
                `Tổng: ${appointmentTrends?.totalAppointments || 0} lịch hẹn`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trendsLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={appointmentTrends?.data || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS.primary}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    name="Số lịch hẹn"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Patient Growth Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tăng trưởng bệnh nhân (30 ngày)</CardTitle>
            <CardDescription>
              {growthLoading ? (
                <span className="flex items-center text-sm">
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Đang tải...
                </span>
              ) : (
                `Tăng trưởng: ${patientGrowth?.totalGrowth || 0} bệnh nhân`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {growthLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientGrowth?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.success, r: 3 }}
                    name="Tổng bệnh nhân"
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.primary, r: 3 }}
                    name="Bệnh nhân mới"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố trạng thái</CardTitle>
            <CardDescription>
              {distributionLoading ? "Đang tải..." : `${appointmentDistribution?.totalAppointments || 0} lịch hẹn`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {distributionLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={appointmentDistribution?.statusDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill={CHART_COLORS.primary}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                  >
                    {(appointmentDistribution?.statusDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Patient Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Nhân khẩu học bệnh nhân</CardTitle>
            <CardDescription>
              {demographicsLoading ? "Đang tải..." : `Tuổi TB: ${patientDemographics?.averageAge || 0}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {demographicsLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={patientDemographics?.ageGroups || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ageGroup" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng hệ thống</CardTitle>
            <CardDescription>
              {healthLoading ? (
                "Đang tải..."
              ) : (
                <span className={`font-semibold ${
                  systemHealth?.overall === 'healthy' ? 'text-green-600' :
                  systemHealth?.overall === 'degraded' ? 'text-amber-600' :
                  'text-red-600'
                }`}>
                  {systemHealth?.overall === 'healthy' ? 'Khỏe mạnh' :
                   systemHealth?.overall === 'degraded' ? 'Suy giảm' :
                   'Nghiêm trọng'}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthLoading ? (
              <div className="h-[250px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Tổng quan</span>
                  <span className="text-gray-600">
                    {systemHealth?.healthyCount}/{systemHealth?.totalCount} services
                  </span>
                </div>
                <Progress value={systemHealth?.healthPercentage || 0} className="h-2" />
                <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto">
                  {systemHealth?.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="capitalize">{service.name}</span>
                      </div>
                      {service.status === 'healthy' && service.responseTime && (
                        <span className="text-gray-500 text-xs">{service.responseTime}ms</span>
                      )}
                      {service.status !== 'healthy' && (
                        <Badge variant="destructive" className="text-xs">Offline</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch hẹn gần đây</CardTitle>
          <CardDescription>
            {recentApptsLoading ? "Đang tải..." : `${recentAppointments?.total || 0} lịch hẹn`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentApptsLoading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Bệnh nhân</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Bác sĩ</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Thời gian</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Loại</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments?.appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium">{appointment.patientName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{appointment.doctorName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{format(new Date(appointment.startAt), 'dd/MM/yyyy HH:mm')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{appointment.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          appointment.status === 'CONFIRMED' ? 'default' :
                          appointment.status === 'COMPLETED' ? 'default' :
                          appointment.status === 'PENDING' ? 'secondary' :
                          'destructive'
                        }>
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={appointment.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                          {appointment.paymentStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Status Banner */}
      {stats?.partial && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">Dữ liệu không đầy đủ</p>
                <p className="text-sm text-amber-700">
                  Một số dịch vụ không khả dụng. Dữ liệu hiển thị có thể không đầy đủ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}