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
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { receptionistService, DailyStatistics } from "@/services/receptionist.service";
import { Appointment } from "@/types/appointment/appointment.type";
import { format } from "date-fns";
import PaymentMethodDialog from "@/components/receptionist/PaymentMethodDialog";
import { toast } from "react-toastify";
import { AppointmentStatus } from "@/types/appointment/index";

export default function ReceptionistDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setStatsLoading(true);
        
        // Fetch appointments and statistics in parallel
        const [appointmentsData, statsData] = await Promise.all([
          receptionistService.getTodayAppointments(),
          receptionistService.getTodaySummary(),
        ]);
        
        setAppointments(appointmentsData);
        setDailyStats(statsData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        toast.error("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalAppointments = appointments.length;
  const checkedInCount = appointments.filter(
    (apt) => apt.status === AppointmentStatus.CHECKED_IN || apt.status === AppointmentStatus.IN_PROGRESS
  ).length;
  const unpaidCount = appointments.filter(
    (apt) => apt.paymentStatus === "UNPAID"
  ).length;
  
  // Use comprehensive statistics from billing service
  const totalRevenue = dailyStats?.totalRevenue || 0;
  const totalTransactions = dailyStats?.totalTransactions || 0;
  const cashRevenue = dailyStats?.cashRevenue || 0;
  const onlineRevenue = dailyStats?.onlineRevenue || 0;

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING)
    .slice(0, 5);

  const handleOpenPayment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setPaymentDialogOpen(true);
  };

  const handleCheckIn = async (appointment: Appointment) => {
    try {
      const result = await receptionistService.checkInPatient(appointment.id);
      
      // Hiển thị thông báo dựa trên payment status
      if (result.paymentStatus !== "PAID") {
        toast.warning(
          `✅ Check-in thành công: ${appointment.patientName}\n⚠️ Lưu ý: Chưa thanh toán - Thu tiền sau khi khám`,
          { autoClose: 5000 }
        );
      } else {
        toast.success(
          `✅ Check-in thành công: ${appointment.patientName}\n💰 Đã thanh toán`
        );
      }
      
      // Refresh danh sách
      const data = await receptionistService.getTodayAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Error check-in:", err);
      toast.error("Check-in thất bại");
    }
  };

  const handlePaymentSuccess = async () => {
    // Refresh both appointments and statistics
    try {
      const [appointmentsData, statsData] = await Promise.all([
        receptionistService.getTodayAppointments(),
        receptionistService.getTodaySummary(),
      ]);
      setAppointments(appointmentsData);
      setDailyStats(statsData);
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

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
              Tổng doanh thu hôm nay
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold text-gray-400">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {(totalRevenue / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalTransactions} giao dịch • Trung bình {dailyStats?.averageTransactionAmount 
                    ? (dailyStats.averageTransactionAmount / 1000).toFixed(0) + 'k' 
                    : '0'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiền mặt</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold text-gray-400">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {(cashRevenue / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  {dailyStats?.paymentMethodBreakdown?.find(m => m.paymentMethod === 'CASH')?.transactionCount || 0} giao dịch
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-2xl font-bold text-gray-400">...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  {(onlineRevenue / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  MOMO + VNPAY
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phân loại</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="text-sm text-gray-400">Đang tải...</div>
            ) : (
              <div className="space-y-1">
                {dailyStats?.paymentTypeBreakdown?.map((type) => (
                  <div key={type.paymentType} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {type.paymentType === 'APPOINTMENT_FEE' ? 'Khám' : 
                       type.paymentType === 'LAB_TEST' ? 'XN' : 
                       type.paymentType === 'PRESCRIPTION' ? 'Thuốc' : type.paymentType}:
                    </span>
                    <span className="font-medium">
                      {(type.revenue / 1000000).toFixed(1)}M ({type.percentage.toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
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
                    <div className="flex items-center gap-2">
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
                      
                      {/* ✅ CHO PHÉP CẢ 2 ACTIONS: Check-in + Thu tiền */}
                      <div className="flex gap-1">
                        {/* Nút Check-in - Không validate payment */}
                        {(apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING) && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCheckIn(apt)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Check-in
                          </Button>
                        )}
                        
                        {/* Nút Thu tiền - Chỉ hiện nếu chưa thanh toán */}
                        {apt.paymentStatus !== "PAID" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenPayment(apt)}
                          >
                            Thu tiền
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Dialog */}
      {selectedAppointment && (
        <PaymentMethodDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          appointmentId={selectedAppointment.id}
          patientName={selectedAppointment.patientName || "Bệnh nhân"}
          amount={parseFloat(selectedAppointment.consultationFee?.toString() || "200000")}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
