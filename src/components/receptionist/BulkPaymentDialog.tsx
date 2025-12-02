"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, Loader2, Receipt, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { billingService, type PaymentMethodType } from "@/services/billing.service";
import type { OutstandingPaymentResponse, BulkPaymentRequest } from "@/types/billing";

interface BulkPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  patientName: string;
  onSuccess?: () => void;
}

export function BulkPaymentDialog({
  open,
  onOpenChange,
  appointmentId,
  patientName,
  onSuccess,
}: BulkPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [outstandingData, setOutstandingData] = useState<OutstandingPaymentResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CASH");

  // Fetch outstanding payments khi dialog mở
  const fetchOutstandingPayments = useCallback(async () => {
    if (!appointmentId) return;
    
    try {
      setFetching(true);
      console.log(`🔍 [BULK PAYMENT] Fetching outstanding payments for appointment: ${appointmentId}`);
      
      const data = await billingService.getOutstandingPayments([appointmentId]);
      
      console.log(`✅ [BULK PAYMENT] Outstanding data:`, data);
      setOutstandingData(data);
    } catch (err) {
      console.error("❌ [BULK PAYMENT] Error fetching outstanding payments:", err);
      toast.error("Không thể tải thông tin thanh toán");
    } finally {
      setFetching(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    if (open) {
      fetchOutstandingPayments();
    }
  }, [open, fetchOutstandingPayments]);

  const handleBulkPayment = async () => {
    if (!outstandingData) return;
    
    const unpaidPayments = outstandingData.payments.filter(
      p => p.status === "PENDING" || p.status === "UNPAID"
    );
    
    if (unpaidPayments.length === 0) {
      toast.warning("Không có khoản nào cần thanh toán");
      return;
    }

    try {
      setLoading(true);
      console.log(`💳 [BULK PAYMENT] Processing bulk payment...`);
      console.log(`   Payment method: ${paymentMethod}`);
      console.log(`   Total amount: ${outstandingData.totalUnpaid}`);
      console.log(`   Payment codes:`, unpaidPayments.map(p => p.paymentCode));

      const request: BulkPaymentRequest = {
        paymentCodes: unpaidPayments.map(p => p.paymentCode),
        paymentMethod: paymentMethod,
        totalAmount: outstandingData.totalUnpaid,
      };

      const result = await billingService.processBulkPayment(request);
      
      console.log(`✅ [BULK PAYMENT] Success:`, result);
      
      toast.success(`Thanh toán thành công ${Number(result.totalAmount).toLocaleString("vi-VN")} VNĐ!`);
      
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("❌ [BULK PAYMENT] Error:", err);
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
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

  const unpaidPayments = outstandingData?.payments.filter(
    p => p.status === "PENDING" || p.status === "UNPAID"
  ) || [];
  
  const paidPayments = outstandingData?.payments.filter(
    p => p.status === "COMPLETED" || p.status === "PAID"
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Thanh toán tổng hợp
          </DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : !outstandingData ? (
          <div className="text-center py-8 text-muted-foreground">
            Không thể tải thông tin thanh toán
          </div>
        ) : (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Bệnh nhân</p>
              <p className="text-lg font-bold text-blue-700">{patientName}</p>
            </div>

            {/* Outstanding Payments */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Các khoản cần thanh toán ({unpaidPayments.length})
              </h3>
              
              {unpaidPayments.length === 0 ? (
                <div className="text-center py-6 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Đã thanh toán đầy đủ</p>
                </div>
              ) : (
                <div className="space-y-2 border rounded-lg divide-y">
                  {unpaidPayments.map((payment) => (
                    <div key={payment.paymentCode} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getPaymentTypeBadge(payment.paymentType)}
                          <span className="text-sm text-muted-foreground font-mono">
                            {payment.paymentCode}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">
                          {Number(payment.amount).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Paid Payments (if any) */}
            {paidPayments.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Đã thanh toán ({paidPayments.length})
                </h3>
                <div className="space-y-2 border rounded-lg divide-y bg-green-50">
                  {paidPayments.map((payment) => (
                    <div key={payment.paymentCode} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getPaymentTypeBadge(payment.paymentType)}
                          <span className="text-sm text-muted-foreground font-mono">
                            {payment.paymentCode}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">
                          {Number(payment.amount).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Total */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng cần thanh toán</p>
                  <p className="text-3xl font-bold text-green-700">
                    {outstandingData.totalUnpaid.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-green-600 opacity-50" />
              </div>
              {outstandingData.totalPaid > 0 && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <p className="text-sm text-green-600">
                    Đã thanh toán: {outstandingData.totalPaid.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            {outstandingData.totalUnpaid > 0 && (
              <>
                <div>
                  <h3 className="font-semibold mb-3">Phương thức thanh toán</h3>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethodType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">💵 Tiền mặt</SelectItem>
                      <SelectItem value="MOMO">📱 Ví MoMo</SelectItem>
                      <SelectItem value="VNPAY">💳 VNPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleBulkPayment}
                    disabled={loading || outstandingData.totalUnpaid <= 0}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Thanh toán {outstandingData.totalUnpaid.toLocaleString("vi-VN")} đ
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
