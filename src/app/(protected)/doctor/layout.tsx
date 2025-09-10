import DoctorSidebar from '@/app/(protected)/doctor/sidebar/DoctorSidebar'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}