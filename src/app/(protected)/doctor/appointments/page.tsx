import { AppointmentsList } from "./component/appointment";


export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Lịch khám</h1>
      </div>
      <AppointmentsList />
    </div>
  )
}
