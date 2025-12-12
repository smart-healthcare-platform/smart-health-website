'use client';

import { usePathname } from 'next/navigation';
import GuardWrapper from "@/components/auth/GuardWrapper";
import { DoctorSidebar } from "./common/doctor-sidebar";
import { DoctorHeader } from "./common/doctor-header";


export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatHistory = pathname?.includes('/chat-history');

  return (
    <GuardWrapper allowedRoles={["DOCTOR"]}>
      <div className={isChatHistory ? "h-screen" : "min-h-screen"}>
        <div className="flex h-full">
          <DoctorSidebar />
          <div className="flex-1 flex flex-col">
            <DoctorHeader />
            <main className={isChatHistory ? "flex-1 overflow-hidden" : "flex-1 p-6"}>{children}</main>
          </div>
        </div>
      </div>
    </GuardWrapper>
  )
}