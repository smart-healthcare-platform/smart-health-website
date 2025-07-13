// 📁 src/app/doctor/settings/page.tsx
import DoctorProfileForm from './components/DoctorProfileForm'

export default function DoctorSettingsPage() {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Cài đặt hồ sơ bác sĩ</h1>
      <DoctorProfileForm />
    </div>
  )
}