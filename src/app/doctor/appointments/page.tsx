// 📁 src/app/doctor/appointments/page.tsx
import AppointmentTable from './components/AppointmentTable'

export default function AppointmentsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Lịch hẹn</h1>
      <AppointmentTable />
    </div>
  )
}