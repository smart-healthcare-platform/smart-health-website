"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserCheck,
  CreditCard,
  User,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { receptionistService } from "@/services/receptionist.service";
import { Appointment } from "@/types/appointment/appointment.type";
import { format } from "date-fns";
import { toast } from "react-toastify";
import PaymentMethodDialog from "@/components/receptionist/PaymentMethodDialog";
import { BulkPaymentDialog } from "@/components/receptionist/BulkPaymentDialog";
import { AppointmentStatus } from "@/types/appointment/index";

export default function CheckInPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "unpaid" | "unchecked">("unchecked");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [bulkPaymentDialogOpen, setBulkPaymentDialogOpen] = useState(false);

  // Fetch appointments hôm nay
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await receptionistService.getTodayAppointments();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch hẹn:", err);
      toast.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Apply filter
  const applyFilter = useCallback((data: Appointment[]) => {
    let filtered = data;

    if (filter === "unpaid") {
      filtered = data.filter((apt) => apt.paymentStatus === "UNPAID");
    } else if (filter === "unchecked") {
      filtered = data.filter(
        (apt) =>
          apt.status === AppointmentStatus.CONFIRMED ||
          apt.status === AppointmentStatus.PENDING ||
          apt.status === AppointmentStatus.CHECKED_IN
      );
    }

    setFilteredAppointments(filtered);
  }, [filter]);

  // Search functionality
  useEffect(() => {
    if (searchKeyword.trim() === "") {
      applyFilter(appointments);
      return;
    }

    const search = async () => {
      try {
        const results = await receptionistService.searchAppointments(searchKeyword);
        applyFilter(results);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword, appointments, applyFilter]);

  useEffect(() => {
    applyFilter(appointments);
  }, [filter, appointments, applyFilter]);

  // Handle check-in - ✅ BỎ VALIDATION PAYMENT
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
      
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (err) {
      console.error("Lỗi check-in:", err);
      toast.error("Check-in thất bại");
    }
  };

  // Get status badge
  const getStatusBadge = (apt: Appointment) => {
    if (apt.status === AppointmentStatus.CHECKED_IN || apt.status === AppointmentStatus.IN_PROGRESS) {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Đã check-in
        </Badge>
      );
    }
    if (apt.status === AppointmentStatus.CANCELLED) {
      return (
        <Badge className="bg-red-500">
          <XCircle className="mr-1 h-3 w-3" />
          Đã hủy
        </Badge>
      );
    }
    return <Badge variant="secondary">Chờ check-in</Badge>;
  };

  const getPaymentBadge = (apt: Appointment) => {
    if (apt.paymentStatus === "PAID") {
      return <Badge className="bg-green-500">Đã thanh toán</Badge>;
    }
    return <Badge className="bg-orange-500">Chưa thanh toán</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm bệnh nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, số điện thoại, hoặc mã lịch hẹn..."
                className="pl-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Tất cả ({appointments.length})
            </Button>
            <Button
              variant={filter === "unchecked" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unchecked")}
            >
              Chưa check-in (
              {
                appointments.filter(
                  (apt) =>
                    apt.status === AppointmentStatus.CONFIRMED || apt.status === AppointmentStatus.PENDING
                ).length
              }
              )
            </Button>
            <Button
              variant={filter === "unpaid" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unpaid")}
            >
              Chưa thanh toán (
              {appointments.filter((apt) => apt.paymentStatus === "UNPAID").length}
              )
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách chờ check-in</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Không tìm thấy lịch hẹn
              </p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedAppointment?.id === apt.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(apt)}
                            {getPaymentBadge(apt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết bệnh nhân</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedAppointment ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chọn một bệnh nhân để xem chi tiết
              </p>
            ) : (
              <div className="space-y-6">
                {/* Patient Info */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    📋 Thông tin bệnh nhân
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Họ tên</p>
                        <p className="font-medium text-base">
                          {selectedAppointment.patientName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                        <p className="text-sm text-orange-600">
                          {/* TODO: Lấy từ Patient Service */}
                          Chưa có thông tin
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Mã bệnh nhân</p>
                        <p className="text-sm font-mono">
                          {selectedAppointment.patientId.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    📅 Thông tin lịch hẹn
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bác sĩ khám</p>
                        <p className="font-medium">{selectedAppointment.doctorName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Thời gian</p>
                        <p className="font-medium">
                          {selectedAppointment.startAt
                            ? format(new Date(selectedAppointment.startAt), "HH:mm - dd/MM/yyyy")
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phí khám</p>
                        <p className="font-medium text-green-600">
                          {Number(selectedAppointment.consultationFee || 200000).toLocaleString("vi-VN")} VNĐ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trạng thái thanh toán</p>
                        <div className="mt-1">{getPaymentBadge(selectedAppointment)}</div>
                      </div>
                    </div>
                    
                    {/* ✅ HIỂN THỊ THỜI GIAN CHECK-IN NẾU ĐÃ CHECK-IN */}
                    {selectedAppointment.checkedInAt && (
                      <div className="flex items-start gap-3">
                        <UserCheck className="h-4 w-4 text-green-600 mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Thời gian check-in</p>
                          <p className="font-medium text-green-600">
                            {format(new Date(selectedAppointment.checkedInAt), "HH:mm - dd/MM/yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t">
                  {/* ✅ NÚT CHECK-IN - Không cần validate payment */}
                  {selectedAppointment.status !== AppointmentStatus.CHECKED_IN &&
                    selectedAppointment.status !== AppointmentStatus.IN_PROGRESS && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCheckIn(selectedAppointment)}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Check-in ngay
                      </Button>
                    )}

                  {/* 🆕 NÚT THANH TOÁN TỔNG HỢP - Ưu tiên hàng đầu */}
                  {(selectedAppointment.status === AppointmentStatus.CHECKED_IN || 
                    selectedAppointment.status === AppointmentStatus.IN_PROGRESS ||
                    selectedAppointment.status === AppointmentStatus.COMPLETED) && (
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg"
                      onClick={() => setBulkPaymentDialogOpen(true)}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Thu tiền tổng hợp
                    </Button>
                  )}

                  {/* ⚠️ NÚT THU TIỀN ĐƠN LẺ - Chỉ cho appointment chưa check-in */}
                  {selectedAppointment.paymentStatus === "UNPAID" && 
                   selectedAppointment.status !== AppointmentStatus.CHECKED_IN &&
                   selectedAppointment.status !== AppointmentStatus.IN_PROGRESS && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Thu phí khám trước
                    </Button>
                  )}

                  {/* ✅ THÔNG BÁO ĐÃ CHECK-IN */}
                  {(selectedAppointment.status === AppointmentStatus.CHECKED_IN ||
                    selectedAppointment.status === AppointmentStatus.IN_PROGRESS) && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Đã check-in thành công</span>
                      </div>
                      {selectedAppointment.checkedInAt && (
                        <p className="text-sm text-green-600">
                          Thời gian: {format(new Date(selectedAppointment.checkedInAt), "HH:mm - dd/MM/yyyy")}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* ✅ GỢI Ý THANH TOÁN SAU KHÁM */}
                  {(selectedAppointment.status === AppointmentStatus.CHECKED_IN || 
                    selectedAppointment.status === AppointmentStatus.IN_PROGRESS) && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-300">
                      <p className="text-sm font-semibold text-blue-700 mb-2">
                        💡 Quy trình thanh toán hiện đại
                      </p>
                      <ul className="text-sm text-blue-600 space-y-1 ml-4">
                        <li>✓ Bệnh nhân đã check-in thành công</li>
                        <li>✓ Bác sĩ đang khám và chỉ định</li>
                        <li>✓ Sử dụng <strong>"Thu tiền tổng hợp"</strong> để thu tất cả chi phí một lần</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Dialog - Hỗ trợ CASH + MOMO + VNPAY */}
      {selectedAppointment && (
        <PaymentMethodDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          appointmentId={selectedAppointment.id}
          patientName={selectedAppointment.patientName || "Bệnh nhân"}
          amount={parseFloat(selectedAppointment.consultationFee?.toString() || "200000")}
          onSuccess={() => {
            toast.success("Thanh toán thành công!");
            fetchAppointments();
            setSelectedAppointment(null);
          }}
        />
      )}

      {/* 🆕 Bulk Payment Dialog - Thu tiền tổng hợp */}
      {selectedAppointment && (
        <BulkPaymentDialog
          open={bulkPaymentDialogOpen}
          onOpenChange={setBulkPaymentDialogOpen}
          appointment={selectedAppointment}
          onSuccess={() => {
            toast.success("Thanh toán tổng hợp thành công!");
            fetchAppointments();
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
}
