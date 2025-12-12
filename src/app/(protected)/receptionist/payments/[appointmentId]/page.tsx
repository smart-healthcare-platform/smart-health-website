"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import ConsolidatedInvoice from "@/components/receptionist/ConsolidatedInvoice";
import PaymentMethodDialog from "@/components/receptionist/PaymentMethodDialog";
import { billingService } from "@/services/billing.service";
import type { OutstandingPaymentResponse, BulkPaymentRequest } from "@/types/billing";

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<OutstandingPaymentResponse | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Fetch outstanding payments for this appointment
  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const data = await billingService.getOutstandingPayments([appointmentId]);
      setPaymentData(data);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      toast.error("Không thể tải thông tin thanh toán");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchPaymentData();
    }
  }, [appointmentId]);

  // Handle bulk payment for all unpaid items
  const handlePayAll = async () => {
    if (!paymentData) return;

    const unpaidPayments = paymentData.payments.filter(
      (p) => p.status === "PENDING" || p.status === "UNPAID" || p.status === "PROCESSING"
    );

    if (unpaidPayments.length === 0) {
      toast.info("Không có khoản thanh toán nào cần xử lý");
      return;
    }

    setPaymentDialogOpen(true);
  };

  // Process bulk payment with selected payment method
  const handlePaymentMethodSelected = async (
    paymentMethod: "CASH" | "MOMO" | "VNPAY",
    notes?: string
  ) => {
    if (!paymentData) return;

    const unpaidPayments = paymentData.payments.filter(
      (p) => p.status === "PENDING" || p.status === "UNPAID" || p.status === "PROCESSING"
    );

    const paymentCodes = unpaidPayments.map((p) => p.paymentCode);
    const totalAmount = paymentData.totalUnpaid;

    const request: BulkPaymentRequest = {
      paymentCodes,
      paymentMethod,
      totalAmount,
      notes,
    };

    try {
      setProcessingPayment(true);
      const response = await billingService.processBulkPayment(request);

      toast.success(
        `Thanh toán thành công ${response.paymentCount} khoản, tổng ${Number(response.totalAmount).toLocaleString("vi-VN")} VND`
      );

      // Refresh payment data
      await fetchPaymentData();
      setPaymentDialogOpen(false);
    } catch (error: any) {
      console.error("Error processing bulk payment:", error);
      const errorMessage = error.response?.data?.message || "Không thể xử lý thanh toán";
      toast.error(errorMessage);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle print invoice
  const handlePrint = () => {
    if (!paymentData) return;

    // Create a printable version
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in. Vui lòng kiểm tra trình chặn popup.");
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hóa đơn - ${appointmentId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Hóa đơn tổng hợp</h1>
          <p><strong>Mã cuộc hẹn:</strong> ${appointmentId}</p>
          ${paymentData.patientName ? `<p><strong>Bệnh nhân:</strong> ${paymentData.patientName}</p>` : ""}
          
          <table>
            <thead>
              <tr>
                <th>Mã thanh toán</th>
                <th>Loại</th>
                <th>Mô tả</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${paymentData.payments
        .map(
          (p) => `
                <tr>
                  <td>${p.paymentCode}</td>
                  <td>${p.paymentType}</td>
                  <td>${p.description || "-"}</td>
                  <td>${p.amount.toLocaleString("vi-VN")} VND</td>
                  <td>${p.status}</td>
                </tr>
              `
        )
        .join("")}
            </tbody>
          </table>
          
          <div class="total">
            <p>Tổng đã thanh toán: ${paymentData.totalPaid.toLocaleString("vi-VN")} VND</p>
            <p>Tổng chưa thanh toán: ${paymentData.totalUnpaid.toLocaleString("vi-VN")} VND</p>
            <p>Tổng cộng: ${(paymentData.totalPaid + paymentData.totalUnpaid).toLocaleString("vi-VN")} VND</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Không tìm thấy thông tin thanh toán</p>
            <Button onClick={() => router.back()} className="mt-4">
              Quay lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết thanh toán</h1>
            <p className="text-sm text-muted-foreground">
              Quản lý thanh toán cho cuộc hẹn #{appointmentId}
            </p>
          </div>
        </div>

        <Button onClick={fetchPaymentData} variant="outline" size="sm">
          <Loader2 className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Consolidated Invoice */}
      <ConsolidatedInvoice
        data={paymentData}
        onPayAll={handlePayAll}
        onPrint={handlePrint}
        loading={processingPayment}
      />

      {/* Payment Method Dialog */}
      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        appointmentId={appointmentId}
        patientName={paymentData.patientName || ""}
        amount={paymentData.totalUnpaid}
        onSuccess={() => {
          fetchPaymentData();
          setPaymentDialogOpen(false);
        }}
      />
    </div>
  );
}
