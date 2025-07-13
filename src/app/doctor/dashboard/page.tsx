import OverviewCards from './components/OverviewCards'
import TodaySchedule from './components/TodaySchedule'
import StatsChart from './components/StatsChart'

export default function DoctorDashboardPage() {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển bác sĩ</h1>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodaySchedule />
        <StatsChart />
      </div>
    </div>
  )
}