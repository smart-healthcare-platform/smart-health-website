import CalendarView from './components/CalendarView'

export default function DoctorSchedulePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Lịch làm việc</h1>
      <CalendarView />
    </div>
  )
}