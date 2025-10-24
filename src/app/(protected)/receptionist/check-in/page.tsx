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
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { CashPaymentDialog } from "@/components/receptionist/CashPaymentDialog";

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
          apt.status === "confirmed" ||
          apt.status === "pending"
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

  // Handle check-in
  const handleCheckIn = async (appointment: Appointment) => {
    if (appointment.paymentStatus === "UNPAID") {
      toast.warning("Bệnh nhân chưa thanh toán. Vui lòng thu tiền trước.");
      return;
    }

    try {
      await receptionistService.checkInPatient(appointment.id);
      toast.success("Check-in thành công!");
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (err) {
      console.error("Lỗi check-in:", err);
      toast.error("Check-in thất bại");
    }
  };

  // Get status badge
  const getStatusBadge = (apt: Appointment) => {
    if (apt.status === "checked_in" || apt.status === "in-progress") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Đã check-in
        </Badge>
      );
    }
    if (apt.status === "cancelled") {
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
                    apt.status === "confirmed" || apt.status === "pending"
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
                    📋 Thông tin cá nhân
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedAppointment.patientName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        ID: {selectedAppointment.patientId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Info */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    📅 Thông tin lịch hẹn
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Bác sĩ: {selectedAppointment.doctorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Giờ:{" "}
                        {selectedAppointment.startAt
                          ? format(new Date(selectedAppointment.startAt), "HH:mm")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Phí khám: {selectedAppointment.consultationFee || "200,000"}{" "}
                        VNĐ
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        Trạng thái TT: {getPaymentBadge(selectedAppointment)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  {selectedAppointment.paymentStatus === "UNPAID" && (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Thu tiền mặt
                    </Button>
                  )}

                  {selectedAppointment.status !== "checked_in" &&
                    selectedAppointment.status !== "in-progress" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCheckIn(selectedAppointment)}
                        disabled={selectedAppointment.paymentStatus === "UNPAID"}
                      >
                        <UserCheck className="mr-2 h-4 w-4" />
                        Check-in ngay
                      </Button>
                    )}

                  {(selectedAppointment.status === "checked_in" ||
                    selectedAppointment.status === "in-progress") && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">Đã check-in thành công</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        appointment={selectedAppointment}
        onSuccess={() => {
          fetchAppointments();
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}
