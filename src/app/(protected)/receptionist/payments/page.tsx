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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  RefreshCw,
  Eye,
  Printer,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { billingService, type PaymentResponse, type PaymentStatus } from "@/services/billing.service";
import { CashPaymentDialog } from "@/components/receptionist/cash-payment-dialog";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [cashPaymentDialogOpen, setCashPaymentDialogOpen] = useState(false);

  // Fetch payments from real API
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Call real API to get today's payments
      const statusParam = statusFilter !== "all" ? (statusFilter as PaymentStatus) : undefined;
      const data = await billingService.getTodayPayments(statusParam);
      
      setPayments(data);
      
      console.log("✅ Fetched payments:", data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách thanh toán:", err);
      toast.error("Không thể tải danh sách thanh toán");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Calculate statistics
  const stats = {
    totalAmount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
    totalCount: payments.length,
    completedCount: payments.filter((p) => p.status === "COMPLETED").length,
  };

  const getPaymentTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; className: string }> = {
      APPOINTMENT_FEE: { label: "Phí khám", className: "bg-blue-500" },
      LAB_TEST: { label: "Xét nghiệm", className: "bg-green-500" },
      PRESCRIPTION: { label: "Đơn thuốc", className: "bg-purple-500" },
      OTHER: { label: "Khác", className: "bg-gray-500" },
    };

    const info = typeMap[type] || { label: type, className: "bg-gray-500" };
    return <Badge className={info.className}>{info.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "COMPLETED") {
      return <Badge className="bg-green-500">Hoàn thành</Badge>;
    }
    if (status === "PENDING") {
      return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const handlePrint = () => {
    toast.info("Tính năng in hóa đơn đang được phát triển");
    // TODO: Implement print functionality
  };

  const handleViewDetail = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý thanh toán</h1>
          <p className="text-muted-foreground">
            Danh sách các giao dịch thanh toán hôm nay
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCashPaymentDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo thanh toán
          </Button>
          <Button onClick={fetchPayments} disabled={loading} variant="outline">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalAmount.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Giao dịch hoàn thành
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="PENDING">Đang xử lý</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
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
            Danh sách thanh toán ({payments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Đang tải...
            </p>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Chưa có giao dịch thanh toán nào
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã thanh toán</TableHead>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Loại thanh toán</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.paymentCode}>
                      <TableCell className="font-mono text-xs">
                        {payment.paymentCode}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.referenceId}
                      </TableCell>
                      <TableCell>
                        {getPaymentTypeBadge(payment.paymentType)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {Number(payment.amount).toLocaleString("vi-VN")} VNĐ
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.paidAt ? format(new Date(payment.paidAt), "HH:mm:ss") : format(new Date(payment.createdAt), "HH:mm:ss")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handlePrint}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Chi tiết thanh toán
            </DialogTitle>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Mã thanh toán</p>
                <p className="text-lg font-mono font-bold text-green-700">
                  {selectedPayment.paymentCode}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Mã tham chiếu:</span>
                  <span className="font-medium">
                    {selectedPayment.referenceId}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Loại thanh toán:</span>
                  {getPaymentTypeBadge(selectedPayment.paymentType)}
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Số tiền:</span>
                  <span className="font-bold text-lg text-green-600">
                    {Number(selectedPayment.amount).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <Badge variant="outline">
                    {selectedPayment.paymentMethod}
                  </Badge>
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  {getStatusBadge(selectedPayment.status)}
                </div>

                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Thời gian:</span>
                  <span>
                    {format(
                      new Date(selectedPayment.paidAt || selectedPayment.createdAt),
                      "HH:mm:ss - dd/MM/yyyy"
                    )}
                  </span>
                </div>

                {selectedPayment.transactionId && (
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Mã giao dịch:
                    </p>
                    <p className="text-sm font-mono">{selectedPayment.transactionId}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handlePrint}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  In hóa đơn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDetailDialogOpen(false)}
                >
                  Đóng
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        open={cashPaymentDialogOpen}
        onOpenChange={setCashPaymentDialogOpen}
        onSuccess={() => {
          toast.success("Thanh toán tiền mặt thành công!");
          fetchPayments();
        }}
      />
    </div>
  );
}
