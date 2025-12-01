"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  UserCheck,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
} from "lucide-react";

const management = [
  {
    name: "Bảng điều khiển",
    href: "/receptionist/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Check-in",
    href: "/receptionist/check-in",
    icon: UserCheck,
    badge: "5",
  },
  {
    name: "Lịch hẹn hôm nay",
    href: "/receptionist/appointments",
    icon: Calendar,
    badge: "12",
  },
  {
    name: "Thanh toán hôm nay",
    href: "/receptionist/payments",
    icon: CreditCard,
  },
  {
    name: "Thanh toán chờ xử lý",
    href: "/receptionist/payments/pending",
    icon: Clock,
  },
  {
    name: "Tìm kiếm",
    href: "/receptionist/search",
    icon: Search,
  },
];

const tools = [
  {
    name: "Hồ sơ cá nhân",
    href: "/receptionist/profile",
    icon: User,
  },
  {
    name: "Cài đặt",
    href: "/receptionist/settings",
    icon: Settings,
  },
];

export function ReceptionistSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">
                Smart Health
              </h2>
              <p className="text-xs text-muted-foreground">Cổng Lễ Tân</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
          title={collapsed ? "Mở rộng" : "Thu gọn"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-3">
          {/* Quản lý */}
          <div>
            {!collapsed && (
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Quản lý
              </h3>
            )}
            <ul className="space-y-1">
              {management.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="ml-3">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Công cụ */}
          <div>
            {!collapsed && (
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Công cụ
              </h3>
            )}
            <ul className="space-y-1">
              {tools.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>Smart Health v1.0</p>
            <p className="mt-1">Receptionist Portal</p>
          </div>
        </div>
      )}
    </div>
  );
}
