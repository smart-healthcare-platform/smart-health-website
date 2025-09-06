// 📁 src/app/doctor/prescriptions/page.tsx
import PrescriptionTable from './components/PrescriptionTable'

export default function PrescriptionsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Đơn thuốc đã kê</h1>
      <PrescriptionTable />
    </div>
  )
}
