import GuardWrapper from "@/components/auth/GuardWrapper";
import { ReceptionistSidebar } from "./common/receptionist-sidebar";
import { ReceptionistHeader } from "./common/receptionist-header";

export default function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuardWrapper allowedRoles={["RECEPTIONIST"]}>
      <div className="min-h-screen">
        <div className="flex">
          <ReceptionistSidebar />
          <div className="flex-1 flex flex-col">
            <ReceptionistHeader />
            <main className="flex-1 p-6 bg-gray-50">{children}</main>
          </div>
        </div>
      </div>
    </GuardWrapper>
  );
}
