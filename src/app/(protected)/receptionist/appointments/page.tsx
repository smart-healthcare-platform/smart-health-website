"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, UserCheck, CreditCard, Eye, RefreshCw } from "lucide-react";
import { receptionistService } from "@/services/receptionist.service";
import { Appointment, AppointmentStatus } from "@/types/appointment";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { CashPaymentDialog } from "@/components/receptionist/CashPaymentDialog";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all"
  );
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "PAID" | "UNPAID"
  >("all");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] =
    useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await receptionistService.getTodayAppointments({
        status: statusFilter !== "all" ? statusFilter : undefined,
        paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
      });
      setAppointments(data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch hẹn:", err);
      toast.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCheckIn = async (appointmentId: string) => {
    try {
      await receptionistService.checkInPatient(appointmentId);
      toast.success("Check-in thành công!");
      fetchAppointments();
    } catch (err) {
      console.error("Lỗi check-in:", err);
      toast.error("Check-in thất bại");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; className: string }
    > = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-500" },
      confirmed: { label: "Đã xác nhận", className: "bg-blue-500" },
      checked_in: { label: "Đã check-in", className: "bg-green-500" },
      "in-progress": { label: "Đang khám", className: "bg-purple-500" },
      completed: { label: "Hoàn thành", className: "bg-gray-500" },
      cancelled: { label: "Đã hủy", className: "bg-red-500" },
      no_show: { label: "Không đến", className: "bg-orange-500" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "bg-gray-500",
    };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (paymentStatus === "PAID") {
      return <Badge className="bg-green-500">Đã thanh toán</Badge>;
    }
    return <Badge className="bg-orange-500">Chưa thanh toán</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý lịch hẹn</h1>
          <p className="text-muted-foreground">
            Danh sách tất cả lịch hẹn hôm nay
          </p>
        </div>
        <Button onClick={fetchAppointments} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Trạng thái lịch hẹn
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as AppointmentStatus | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="checked_in">Đã check-in</SelectItem>
                  <SelectItem value="in-progress">Đang khám</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="no_show">Không đến</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Trạng thái thanh toán
              </label>
              <Select
                value={paymentFilter}
                onValueChange={(value) =>
                  setPaymentFilter(value as "all" | "PAID" | "UNPAID")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="PAID">Đã thanh toán</SelectItem>
                  <SelectItem value="UNPAID">Chưa thanh toán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách lịch hẹn ({appointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Đang tải...
            </p>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Không có lịch hẹn nào
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã LH</TableHead>
                    <TableHead>Giờ khám</TableHead>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Bác sĩ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Phí khám</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-mono text-xs">
                        {apt.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {apt.startAt
                          ? format(new Date(apt.startAt), "HH:mm")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {apt.patientId.slice(0, 8)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{apt.doctorName}</TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell>{getPaymentBadge(apt.paymentStatus || "UNPAID")}</TableCell>
                      <TableCell>
                        {apt.consultationFee
                          ? `${apt.consultationFee.toLocaleString()} VNĐ`
                          : "200,000 VNĐ"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {apt.status !== "checked_in" &&
                              apt.status !== "in-progress" && (
                                <DropdownMenuItem
                                  onClick={() => handleCheckIn(apt.id)}
                                  disabled={apt.paymentStatus === "UNPAID"}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Check-in
                                </DropdownMenuItem>
                              )}
                            {apt.paymentStatus === "UNPAID" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAppointmentForPayment(apt);
                                  setPaymentDialogOpen(true);
                                }}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Thu tiền
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        appointment={selectedAppointmentForPayment}
        onSuccess={() => {
          fetchAppointments();
          setSelectedAppointmentForPayment(null);
        }}
      />
    </div>
  );
}
