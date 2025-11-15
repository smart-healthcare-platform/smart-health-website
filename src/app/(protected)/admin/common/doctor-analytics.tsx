"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserCheck,
  Activity,
  Star,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Award,
  AlertCircle,
} from "lucide-react"
import {
  useDoctorStats,
  useTopDoctors,
  // useDoctorDemographics, // TODO: Not yet implemented in API Gateway
  // useRecentDoctors, // TODO: Not yet implemented in API Gateway
} from "@/hooks/useAdminDashboard"
import { Skeleton } from "@/components/ui/skeleton"

export function DoctorAnalytics() {
  const { data: doctorStats, isLoading: statsLoading, error: statsError } = useDoctorStats()
  // const { data: demographics, isLoading: demographicsLoading, error: demographicsError } = useDoctorDemographics()
  const { data: topDoctorsData, isLoading: topDoctorsLoading, error: topDoctorsError } = useTopDoctors(1, 5)
  // const { data: recentDoctors, isLoading: recentDoctorsLoading, error: recentDoctorsError } = useRecentDoctors(1, 5)
  
  // Use topByAppointments as the main list to display
  const topDoctors = topDoctorsData?.topByAppointments || []

  if (statsLoading) {
    return <DoctorAnalyticsSkeleton />
  }

  // Show info banner if critical data failed to load but continue rendering with safe defaults
  const hasErrors = statsError // || demographicsError

  // Provide safe defaults
  const safeStats = {
    totalDoctors: doctorStats?.totalDoctors ?? 0,
    activeDoctors: doctorStats?.activeDoctors ?? 0,
    onlineDoctors: doctorStats?.onlineDoctors ?? 0,
    offlineDoctors: doctorStats?.offlineDoctors ?? 0,
    newDoctorsThisMonth: doctorStats?.newDoctorsThisMonth ?? 0,
    newDoctorsThisWeek: doctorStats?.newDoctorsThisWeek ?? 0,
    averageRating: doctorStats?.averageRating ?? 0,
    totalAppointments: doctorStats?.totalAppointments ?? 0,
    totalRevenue: doctorStats?.totalRevenue ?? 0,
    fromCache: doctorStats?.fromCache,
  }

  const statsCards = [
    {
      title: "Total Doctors",
      value: safeStats.totalDoctors ?? 0,
      change: safeStats.newDoctorsThisMonth 
        ? `+${safeStats.newDoctorsThisMonth} this month`
        : "No new doctors",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Doctors",
      value: safeStats.activeDoctors ?? 0,
      change: `${(((safeStats.activeDoctors ?? 0) / (safeStats.totalDoctors || 1)) * 100).toFixed(1)}% active rate`,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      title: "Online Now",
      value: safeStats.onlineDoctors ?? 0,
      change: `${safeStats.offlineDoctors ?? 0} offline`,
      icon: Activity,
      color: "text-emerald-500",
    },
    {
      title: "Average Rating",
      value: (safeStats.averageRating ?? 0).toFixed(1),
      change: `From ${safeStats.totalAppointments ?? 0} appointments`,
      icon: Star,
      color: "text-yellow-500",
    },
  ]

  // TODO: Enable when demographics endpoint is implemented
  // const specialtyChartData = demographics?.specialties?.map((s) => ({
  //   name: s.specialty,
  //   value: s.count,
  //   percentage: s.percentage,
  // })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Doctor Analytics</h2>
          <p className="text-muted-foreground">Comprehensive doctor performance and statistics</p>
        </div>
        {safeStats.fromCache && (
          <Badge variant="outline" className="text-xs">
            Cached data
          </Badge>
        )}
        {topDoctorsError && (
          <Badge variant="outline" className="text-xs text-warning">
            Some data unavailable
          </Badge>
        )}
      </div>

      {/* Error Banner */}
      {hasErrors && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Doctor Service Unavailable</p>
                <p className="text-sm text-amber-700 mt-1">
                  Unable to connect to the Doctor service. Showing default values. Please ensure the service is running.
                </p>
                {statsError && (
                  <p className="text-xs text-amber-600 mt-1">
                    Error: {statsError.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialty Distribution - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Specialty Distribution
              <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
            </CardTitle>
            <CardDescription>
              Doctors by specialty distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Specialty Distribution Analytics</p>
              <p className="text-sm text-muted-foreground">
                This feature is coming soon. The API endpoint is being implemented.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Top Performers
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Highest rated and most active doctors</CardDescription>
          </CardHeader>
          <CardContent>
            {topDoctorsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : topDoctors && topDoctors.length > 0 ? (
              <div className="space-y-3">
                {topDoctors.map((doctor, index) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doctor.fullName}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          {doctor.averageRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {doctor.completedAppointments}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {(doctor.totalRevenue || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : topDoctorsError ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">Unable to load top doctors</p>
                <Badge variant="outline" className="text-xs">
                  Error: {topDoctorsError.message}
                </Badge>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No top doctors data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Doctors - Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recently Added Doctors
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </CardTitle>
          <CardDescription>
            Latest doctor registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Recent Doctors List</p>
            <p className="text-sm text-muted-foreground">
              This feature is coming soon. The API endpoint is being implemented.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DoctorAnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}