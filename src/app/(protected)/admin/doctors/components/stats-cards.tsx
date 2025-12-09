"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, UserCheck, Users, UserPlus, Clock } from "lucide-react"

interface StatItem {
  value: number
  change: number
}

interface DoctorStatsCardsProps {
  totalDoctors: StatItem
  newThisMonth: StatItem
  averageAge: StatItem
}

export function DoctorStatsCards({ totalDoctors, newThisMonth, averageAge }: DoctorStatsCardsProps) {
  const statsData = [
    { title: "Tổng bác sĩ", value: totalDoctors.value, change: totalDoctors.change, icon: Users },
    { title: "Bác sĩ mới trong tháng", value: newThisMonth.value, change: newThisMonth.change, icon: UserPlus },
    { title: "Độ tuổi trung bình", value: averageAge.value.toFixed(1), change: averageAge.change, icon: UserCheck },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const TrendIcon = stat.change < 0 ? ArrowDown : ArrowUp
        const trendColor =
          stat.change > 0 ? "text-green-500" : stat.change < 0 ? "text-red-500" : "text-muted-foreground"

        return (
          <Card key={index} className="bg-white shadow-md rounded-lg">
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-6 w-6 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                <TrendIcon className={`h-3 w-3 ${trendColor} mr-1`} />
                <span className={trendColor}>{stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}</span>
                <span className="ml-1 text-muted-foreground">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
