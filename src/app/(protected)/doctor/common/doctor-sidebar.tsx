"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Brain,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react"

const navigation = [
  {
    name: "Bảng điều khiển",
    href: "/doctor",
    icon: LayoutDashboard,
  },
  {
    name: "Lịch khám",
    href: "/doctor/appointments",
    icon: Calendar,
  },
  {
    name: "Bệnh nhân",
    href: "/doctor/patients",
    icon: Users,
  },
  {
    name: "Hồ sơ bệnh án",
    href: "/doctor/medical-records",
    icon: FileText,
  },
  {
    name: "Chẩn đoán AI",
    href: "/doctor/ai-diagnosis",
    icon: Brain,
  },
  {
    name: "Hồ sơ cá nhân",
    href: "/doctor/profile",
    icon: User,
  },
]

export function DoctorSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/caring-doctor.png" />
              <AvatarFallback>BS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-accent-foreground truncate">
                Bác sĩ Nguyễn Văn A
              </p>
              <p className="text-xs text-muted-foreground truncate">Chuyên khoa Tim mạch</p>
              <p className="text-xs text-primary font-medium">Đang hoạt động</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <Settings className="w-4 h-4" />
          {!collapsed && "Cài đặt"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-2",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Đăng xuất"}
        </Button>
      </div>
    </div>
  )
}
