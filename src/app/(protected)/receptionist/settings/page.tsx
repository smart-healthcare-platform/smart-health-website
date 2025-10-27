"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Bell, Monitor, Printer } from "lucide-react";

export default function SettingsPage() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">
          Tùy chỉnh cài đặt cho cổng lễ tân
        </p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Bật thông báo</Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có lịch hẹn mới hoặc cập nhật
              </p>
            </div>
            <Badge className="bg-green-500">Đang bật</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Hiển thị
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoRefresh">Tự động làm mới</Label>
              <p className="text-sm text-muted-foreground">
                Tự động cập nhật danh sách lịch hẹn mỗi 60 giây
              </p>
            </div>
            <Badge className="bg-green-500">Đang bật</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Printing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            In ấn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoPrint">Tự động in phiếu</Label>
              <p className="text-sm text-muted-foreground">
                Tự động in phiếu khám sau khi check-in thành công
              </p>
            </div>
            <Badge variant="secondary">Đang tắt</Badge>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Cấu hình máy in
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Thông tin hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phiên bản:</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Môi trường:</span>
            <span className="font-medium">Production</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cập nhật lần cuối:</span>
            <span className="font-medium">24/10/2025</span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Lưu cài đặt
        </Button>
      </div>
    </div>
  );
}
