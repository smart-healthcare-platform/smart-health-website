"use client";

import type React from "react";
import { AdminSidebar } from "./common/admin-sidebar";
import { AdminHeader } from "./common/admin-header";
import GuardWrapper from "@/components/auth/GuardWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuardWrapper allowedRoles={["ADMIN"]}>
      <div className="min-h-screen">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </div>
    </GuardWrapper>
  );
}
