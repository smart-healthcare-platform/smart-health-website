"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  UserCheck,
  AlertCircle,
  DollarSign,
  Search,
  CreditCard,
  FileText,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { receptionistService } from "@/services/receptionist.service";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        setLoading(true);
        const data = await receptionistService.getTodayAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch hẹn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  const totalAppointments = appointments.length;
  const checkedInCount = appointments.filter(
    (apt) => apt.status === "checked_in" || apt.status === "in-progress"
  ).length;
  const unpaidCount = appointments.filter(
    (apt) => apt.paymentStatus === "UNPAID"
  ).length;
  const paidAmount = appointments
    .filter((apt) => apt.paymentStatus === "PAID")
    .reduce((sum, apt) => sum + parseFloat(apt.paidAmount || "0"), 0);

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "confirmed" || apt.status === "pending")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lịch hẹn hôm nay
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {totalAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              {unpaidCount} chưa check-in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã check-in</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {checkedInCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAppointments > 0
                ? Math.round((checkedInCount / totalAppointments) * 100)
                : 0}
              % hoàn thành
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chưa thanh toán
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {unpaidCount}
            </div>
            <p className="text-xs text-muted-foreground">Cần thu tiền</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu hôm nay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(paidAmount / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              {appointments.filter((apt) => apt.paymentStatus === "PAID").length}{" "}
              giao dịch
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700">
              <UserCheck className="h-6 w-6" />
              <span>Check-in nhanh</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-blue-200 hover:bg-blue-50"
            >
              <Search className="h-6 w-6" />
              <span>Tìm lịch hẹn</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-green-200 hover:bg-green-50"
            >
              <CreditCard className="h-6 w-6 text-green-600" />
              <span>Thu tiền</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-gray-200 hover:bg-gray-50"
            >
              <FileText className="h-6 w-6" />
              <span>In phiếu khám</span>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch hẹn sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Không có lịch hẹn sắp tới
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.startAt
                            ? format(new Date(apt.startAt), "HH:mm")
                            : "N/A"}{" "}
                          - {apt.doctorName}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        apt.paymentStatus === "PAID" ? "default" : "secondary"
                      }
                      className={
                        apt.paymentStatus === "PAID"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }
                    >
                      {apt.paymentStatus === "PAID" ? "Đã TT" : "Chưa TT"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
