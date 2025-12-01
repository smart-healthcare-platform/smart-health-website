"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RefreshCw,
  Eye,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { appointmentService } from "@/services/appointment.service";
import { billingService } from "@/services/billing.service";
import type { Appointment } from "@/types/appointment";
import type { OutstandingPaymentResponse } from "@/types/billing";

interface AppointmentWithPayment extends Appointment {
  paymentInfo?: OutstandingPaymentResponse;
  totalUnpaid?: number;
}

export default function PendingPaymentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentWithPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch today's appointments and their payment status
  const fetchPendingPayments = useCallback(async () => {
    try {
      setLoading(true);

      // Step 1: Get today's appointments
      const todayAppointments = await appointmentService.getTodayAppointments();
      
      if (todayAppointments.length === 0) {
        setAppointments([]);
        return;
      }

      // Step 2: Get payment info for all appointments
      const appointmentIds = todayAppointments.map((apt) => apt.id);
      
      // Fetch payment info for all appointments in one call
      const paymentPromises = appointmentIds.map(async (id) => {
        try {
          const paymentInfo = await billingService.getOutstandingPayments([id]);
          return { appointmentId: id, paymentInfo };
        } catch (error) {
          console.error(`Error fetching payment for appointment ${id}:`, error);
          return { appointmentId: id, paymentInfo: null };
        }
      });

      const paymentResults = await Promise.all(paymentPromises);

      // Step 3: Combine appointment and payment data
      const appointmentsWithPayment: AppointmentWithPayment[] = todayAppointments.map((apt) => {
        const paymentResult = paymentResults.find((p) => p.appointmentId === apt.id);
        const paymentInfo = paymentResult?.paymentInfo || undefined;
        const totalUnpaid = paymentInfo?.totalUnpaid || 0;

        return {
          ...apt,
          paymentInfo,
          totalUnpaid,
        };
      });

      // Filter only appointments with unpaid payments
      const withUnpaidPayments = appointmentsWithPayment.filter(
        (apt) => (apt.totalUnpaid || 0) > 0
      );

      setAppointments(withUnpaidPayments);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      toast.error("Không thể tải danh sách thanh toán chờ xử lý");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchTerm === "" ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patient?.phoneNumber?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalAppointments: filteredAppointments.length,
    totalUnpaid: filteredAppointments.reduce((sum, apt) => sum + (apt.totalUnpaid || 0), 0),
    avgUnpaid:
      filteredAppointments.length > 0
        ? filteredAppointments.reduce((sum, apt) => sum + (apt.totalUnpaid || 0), 0) /
          filteredAppointments.length
        : 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Chờ khám", variant: "secondary" as const },
      CONFIRMED: { label: "Đã xác nhận", variant: "default" as const },
      CHECKED_IN: { label: "Đã check-in", variant: "default" as const },
      IN_PROGRESS: { label: "Đang khám", variant: "default" as const },
      COMPLETED: { label: "Hoàn thành", variant: "default" as const },
      CANCELLED: { label: "Đã hủy", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "outline" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleViewDetails = (appointmentId: string) => {
    router.push(`/receptionist/payments/${appointmentId}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Thanh toán chờ xử lý</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách các cuộc hẹn có thanh toán chưa hoàn tất
          </p>
        </div>
        <Button onClick={fetchPendingPayments} variant="outline" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng cuộc hẹn chưa thanh toán
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">cuộc hẹn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng tiền chưa thanh toán
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.totalUnpaid)}
            </div>
            <p className="text-xs text-muted-foreground">cần thu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trung bình mỗi cuộc hẹn
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.avgUnpaid)}
            </div>
            <p className="text-xs text-muted-foreground">TB/cuộc hẹn</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm & Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã cuộc hẹn, tên bệnh nhân, SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="PENDING">Chờ khám</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="CHECKED_IN">Đã check-in</SelectItem>
                <SelectItem value="IN_PROGRESS">Đang khám</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thanh toán chờ xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã cuộc hẹn</TableHead>
                  <TableHead>Bệnh nhân</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Số tiền chưa thanh toán</TableHead>
                  <TableHead className="text-right">Số khoản</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Đang tải...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Không có thanh toán chờ xử lý
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-mono text-sm">
                        {apt.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {apt.patient?.fullName || "-"}
                      </TableCell>
                      <TableCell>{apt.patient?.phoneNumber || "-"}</TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(apt.appointmentDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-right font-semibold text-yellow-600">
                        {formatCurrency(apt.totalUnpaid || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">
                          {apt.paymentInfo?.payments.filter(
                            (p) => p.status === "PENDING" || p.status === "UNPAID"
                          ).length || 0}{" "}
                          khoản
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(apt.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
