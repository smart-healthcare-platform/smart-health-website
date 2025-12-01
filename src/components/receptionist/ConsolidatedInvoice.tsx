"use client";

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
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Printer,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import type { OutstandingPaymentResponse, PaymentItem } from "@/types/billing";

interface ConsolidatedInvoiceProps {
  data: OutstandingPaymentResponse;
  onPayAll?: () => void;
  onPrint?: () => void;
  loading?: boolean;
}

export default function ConsolidatedInvoice({
  data,
  onPayAll,
  onPrint,
  loading = false,
}: ConsolidatedInvoiceProps) {
  const { appointmentId, patientName, totalUnpaid, totalPaid, payments } = data;

  const getPaymentStatusBadge = (status: PaymentItem["status"]) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Đã thanh toán
          </Badge>
        );
      case "PENDING":
      case "UNPAID":
        return (
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Chưa thanh toán
          </Badge>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Thất bại
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge variant="outline">
            Đã hoàn tiền
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentTypeLabel = (type: PaymentItem["paymentType"]) => {
    switch (type) {
      case "APPOINTMENT_FEE":
        return "Phí khám";
      case "LAB_TEST":
        return "Xét nghiệm";
      case "PRESCRIPTION":
        return "Đơn thuốc";
      case "OTHER":
        return "Khác";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(dateString));
  };

  const hasUnpaidPayments = totalUnpaid > 0;
  const unpaidPayments = payments.filter(
    (p) => p.status === "PENDING" || p.status === "UNPAID"
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Hóa đơn tổng hợp
            </CardTitle>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Mã cuộc hẹn:</span> {appointmentId}
              </p>
              {patientName && (
                <p>
                  <span className="font-medium">Bệnh nhân:</span> {patientName}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {onPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrint}
                disabled={loading}
              >
                <Printer className="mr-2 h-4 w-4" />
                In hóa đơn
              </Button>
            )}
            {onPayAll && hasUnpaidPayments && (
              <Button
                size="sm"
                onClick={onPayAll}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Thanh toán tất cả
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Payment Items Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã thanh toán</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày thanh toán</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Không có khoản thanh toán nào
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.paymentCode}>
                    <TableCell className="font-mono text-sm">
                      {payment.paymentCode}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPaymentTypeLabel(payment.paymentType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {payment.description || "-"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(payment.paidAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Section */}
        <div className="mt-6 space-y-3">
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Tổng đã thanh toán:
            </span>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(totalPaid)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Tổng chưa thanh toán:
            </span>
            <span className="text-lg font-semibold text-yellow-600">
              {formatCurrency(totalUnpaid)}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold">Tổng cộng:</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalPaid + totalUnpaid)}
            </span>
          </div>

          {hasUnpaidPayments && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">
                Còn {unpaidPayments.length} khoản thanh toán chưa hoàn tất
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Vui lòng thanh toán để hoàn tất quy trình khám bệnh
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
