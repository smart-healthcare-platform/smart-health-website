"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  Settings,
  Activity,
  FileText,
  Shield,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: "Patients",
    href: "/admin/patients",
    icon: Users,
    current: false,
    badge: "2,847",
  },
  {
    name: "Doctors",
    href: "/admin/doctors",
    icon: UserCheck,
    current: false,
    badge: "124",
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
    current: false,
    badge: "18",
  },
]

const analytics = [
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: Activity,
    current: false,
  },
  {
    name: "Medical Records",
    href: "/admin/records",
    icon: FileText,
    current: false,
  },
]

const system = [
  {
    name: "Database",
    href: "/admin/database",
    icon: Database,
    current: false,
  },
  {
    name: "Security",
    href: "/admin/security",
    icon: Shield,
    current: false,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    current: false,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">Smart Health</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-3">
          {/* Main Navigation */}
          <div>
            {!collapsed && (
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Management
              </h3>
            )}
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="ml-3">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Analytics */}
          <div>
            {!collapsed && (
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Analytics
              </h3>
            )}
            <ul className="space-y-1">
              {analytics.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* System */}
          <div>
            {!collapsed && (
              <h3 className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">System</h3>
            )}
            <ul className="space-y-1">
              {system.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}
