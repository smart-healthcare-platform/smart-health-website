// 📁 src/app/doctor/patients/page.tsx
import PatientTable from './components/PatientTable'

export default function PatientsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Danh sách bệnh nhân</h1>
      <PatientTable />
    </div>
  )
}
