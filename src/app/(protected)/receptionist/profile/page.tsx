"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Briefcase, Clock, Calendar } from "lucide-react";

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || user.role !== "RECEPTIONIST") {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Không tìm thấy thông tin người dùng</p>
      </div>
    );
  }

  const profile = user.profile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Thông tin tài khoản lễ tân của bạn
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {profile.fullName?.charAt(0).toUpperCase() || "LT"}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.fullName}</h2>
              <Badge className="bg-blue-600 mt-1">Lễ tân</Badge>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Họ và tên</p>
                <p className="font-medium">{profile.fullName || "Chưa cập nhật"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email || "Chưa cập nhật"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Mã nhân viên</p>
                <p className="font-medium font-mono">
                  {profile.employeeId || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Phòng ban</p>
                <p className="font-medium">{profile.department || "Front Desk"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ca làm việc</p>
                <p className="font-medium">
                  {profile.shift === "morning" && "Sáng (7:00 - 12:00)"}
                  {profile.shift === "afternoon" && "Chiều (12:00 - 17:00)"}
                  {profile.shift === "night" && "Tối (17:00 - 22:00)"}
                  {profile.shift === "full-time" && "Toàn thời gian"}
                  {!profile.shift && "Chưa cập nhật"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">ID người dùng</p>
                <p className="font-medium font-mono text-xs">
                  {user.referenceId?.slice(0, 20)}...
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê làm việc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Check-in hôm nay</p>
              <p className="text-2xl font-bold text-blue-600">--</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Thu tiền hôm nay</p>
              <p className="text-2xl font-bold text-green-600">--</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-purple-600">--</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Tính năng thống kê chi tiết đang được phát triển
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
