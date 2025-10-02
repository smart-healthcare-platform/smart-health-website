import GuardWrapper from "@/components/auth/GuardWrapper";
import { DoctorSidebar } from "./common/doctor-sidebar";
import { DoctorHeader } from "./common/doctor-header";


export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuardWrapper allowedRoles={["DOCTOR"]}>
      <div className="min-h-screen">
        <div className="flex">
          <DoctorSidebar />
          <div className="flex-1 flex flex-col">
            <DoctorHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </GuardWrapper>
  )
}