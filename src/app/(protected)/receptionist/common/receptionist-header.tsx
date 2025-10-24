"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import { useCallback, useState } from "react";
import { authService } from "@/services/auth.service";
import { clearAuth } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { QuickCheckInDialog } from "@/components/receptionist/QuickCheckInDialog";

export function ReceptionistHeader() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [quickCheckInOpen, setQuickCheckInOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Đăng xuất thất bại:", err);
    } finally {
      dispatch(clearAuth());
      router.push("/login");
    }
  }, [dispatch, router]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      {/* Thanh tìm kiếm */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bệnh nhân hoặc lịch hẹn..."
            className="pl-10 bg-muted border-0"
          />
        </div>
      </div>

      {/* Phần bên phải */}
      <div className="flex items-center space-x-4">
        {/* Badge cổng lễ tân */}
        <Badge
          variant="outline"
          className="text-xs font-medium text-blue-600 border-blue-500/50"
        >
          Cổng Lễ Tân
        </Badge>

        {/* Thông báo */}
        <Button variant="ghost" size="sm" className="relative" title="Thông báo">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-blue-500 text-white">
            3
          </Badge>
        </Button>

        {/* Quick Check-in */}
        <Button 
          variant="ghost" 
          size="sm" 
          title="Check-in nhanh"
          onClick={() => setQuickCheckInOpen(true)}
        >
          <UserCheck className="h-5 w-5" />
        </Button>

        {/* Trợ giúp */}
        <Button variant="ghost" size="sm" title="Trợ giúp">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Menu người dùng */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    user?.role === "RECEPTIONIST"
                      ? user.profile.avatar || "/avatars/receptionist.png"
                      : "/avatars/default.png"
                  }
                  alt="Lễ tân"
                />
                <AvatarFallback>LT</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="px-3 py-2">
              <p className="text-sm font-medium leading-none text-foreground">
                {user?.role === "RECEPTIONIST"
                  ? user.profile.fullName
                  : "Lễ tân"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tài khoản lễ tân
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/receptionist/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ cá nhân</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/receptionist/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Check-in Dialog */}
      <QuickCheckInDialog
        open={quickCheckInOpen}
        onOpenChange={setQuickCheckInOpen}
        onSuccess={() => {
          // Optional: Refresh dashboard or show success
        }}
      />
    </header>
  );
}
