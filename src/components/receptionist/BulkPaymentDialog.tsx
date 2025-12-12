"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, DollarSign, Loader2, Receipt, CheckCircle2, QrCode, ExternalLink, Printer } from "lucide-react";
import { toast } from "react-toastify";
import { billingService, type PaymentMethodType } from "@/services/billing.service";
import type { OutstandingPaymentResponse, BulkPaymentRequest } from "@/types/billing";
import type { CompositePaymentResponse } from "@/services/billing.service";
import { PrescriptionPrintDialog } from "./PrescriptionPrintDialog";
import { AppointmentStatus } from "@/types/appointment/index";

import type { Appointment } from "@/types/appointment/appointment.type";

interface BulkPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
  onSuccess?: () => void;
}

export function BulkPaymentDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: BulkPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [outstandingData, setOutstandingData] = useState<OutstandingPaymentResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("CASH");
  const [compositePayment, setCompositePayment] = useState<CompositePaymentResponse | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);

  // Build referenceIds helper
  const getReferenceIds = useCallback(() => {
    if (!appointment) return [];
    
    const referenceIds = [appointment.id];
    
    if (appointment.labTestOrders && appointment.labTestOrders.length > 0) {
      const labTestOrderIds = appointment.labTestOrders.map(order => order.id);
      referenceIds.push(...labTestOrderIds);
    }
    
    return referenceIds;
  }, [appointment]);

  // Fetch outstanding payments khi dialog mở
  const fetchOutstandingPayments = useCallback(async () => {
    if (!appointment) return;
    
    try {
      setFetching(true);
      
      const referenceIds = getReferenceIds();
      
      const data = await billingService.getOutstandingPayments(referenceIds);
      setOutstandingData(data);
    } catch (err) {
      console.error("[BulkPaymentDialog] Error fetching outstanding payments:", err);
      toast.error("Không thể tải thông tin thanh toán");
    } finally {
      setFetching(false);
    }
  }, [appointment, getReferenceIds]);

  useEffect(() => {
    if (open) {
      fetchOutstandingPayments();
      setCompositePayment(null);
      setShowQrCode(false);
    } else {
      // Cleanup polling khi đóng dialog
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }
  }, [open, fetchOutstandingPayments]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Polling function để check payment status
  const startPollingPaymentStatus = useCallback((paymentId: number) => {
    // Clear existing interval nếu có
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    let pollCount = 0;
    const maxPolls = 100; // Poll tối đa 100 lần (5 phút)

    pollingIntervalRef.current = setInterval(async () => {
      pollCount++;
      
      if (pollCount > maxPolls) {
        clearInterval(pollingIntervalRef.current!);
        pollingIntervalRef.current = null;
        toast.warning("Hết thời gian chờ thanh toán. Vui lòng kiểm tra lại.");
        return;
      }

      try {
        const payment = await billingService.getPaymentStatus(paymentId);

        if (payment.status === "COMPLETED") {
          clearInterval(pollingIntervalRef.current!);
          pollingIntervalRef.current = null;
          
          toast.success("✅ Thanh toán thành công!");
          setShowQrCode(false);
          setCompositePayment(null);
          
          // Kiểm tra và mở dialog in đơn thuốc nếu có
          if (appointment.status === AppointmentStatus.COMPLETED && appointment.prescriptionId) {
            setPrescriptionDialogOpen(true);
          } else {
            onOpenChange(false);
            onSuccess?.();
          }
        } else if (payment.status === "FAILED") {
          clearInterval(pollingIntervalRef.current!);
          pollingIntervalRef.current = null;
          
          toast.error("❌ Thanh toán thất bại");
          setShowQrCode(false);
          setCompositePayment(null);
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 3000); // Poll mỗi 3 giây
  }, [onOpenChange, onSuccess]);

  const handleBulkPayment = async () => {
    if (!outstandingData) return;
    
    const unpaidPayments = outstandingData.payments.filter(
      p => p.status === "PENDING" || p.status === "UNPAID" || p.status === "PROCESSING"
    );
    
    if (unpaidPayments.length === 0) {
      toast.warning("Không có khoản nào cần thanh toán");
      return;
    }

    try {
      setLoading(true);

      // Nếu là thanh toán online (MOMO/VNPAY), dùng composite payment
      if (paymentMethod === "MOMO" || paymentMethod === "VNPAY") {
        const referenceIds = getReferenceIds();

        const compositeResponse = await billingService.createCompositePayment({
          appointmentId: appointment.id,
          referenceIds: referenceIds,
          paymentMethod: paymentMethod,
          description: `Thanh toán tổng hợp cho lịch khám ${appointment.id}`,
        });
        
        setCompositePayment(compositeResponse);
        setShowQrCode(true);
        
        // Mở payment URL trong tab mới
        if (compositeResponse.paymentUrl) {
          window.open(compositeResponse.paymentUrl, "_blank");
        }

        // Bắt đầu polling để check trạng thái
        startPollingPaymentStatus(compositeResponse.paymentId);
        
        toast.info("Vui lòng hoàn tất thanh toán trên trang thanh toán đã mở");
      } else {
        // Thanh toán tiền mặt - dùng bulk payment như cũ
        const request: BulkPaymentRequest = {
          paymentCodes: unpaidPayments.map(p => p.paymentCode),
          paymentMethod: paymentMethod,
          totalAmount: outstandingData.totalUnpaid,
        };

        const result = await billingService.processBulkPayment(request);
        
        toast.success(`Thanh toán thành công ${Number(result.totalAmount).toLocaleString("vi-VN")} VNĐ!`);
        
        // Kiểm tra và mở dialog in đơn thuốc nếu có
        if (appointment.status === AppointmentStatus.COMPLETED && appointment.prescriptionId) {
          setPrescriptionDialogOpen(true);
        } else {
          onOpenChange(false);
          onSuccess?.();
        }
      }
    } catch (err) {
      console.error("[BulkPaymentDialog] Payment error:", err);
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
    p => p.status === "PENDING" || p.status === "UNPAID" || p.status === "PROCESSING"
  ) || [];
  
  const paidPayments = outstandingData?.payments.filter(
    p => p.status === "COMPLETED" || p.status === "PAID"
  ) || [];

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            {showQrCode ? "Chờ thanh toán..." : "Thanh toán tổng hợp"}
          </DialogTitle>
        </DialogHeader>

        {/* Show QR Code / Payment Waiting State */}
        {showQrCode && compositePayment ? (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <QrCode className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đang chờ thanh toán</h3>
              <p className="text-muted-foreground mb-4">
                Vui lòng hoàn tất thanh toán trên trang đã mở
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground">Tổng thanh toán</p>
                <p className="text-3xl font-bold text-green-700">
                  {compositePayment.totalAmount.toLocaleString("vi-VN")} đ
                </p>
              </div>

              <div className="text-left bg-gray-50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm mb-2">Chi tiết thanh toán:</h4>
                {compositePayment.breakdown.map((item) => (
                  <div key={item.paymentCode} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.paymentType}</span>
                    <span className="font-medium">{item.amount.toLocaleString("vi-VN")} đ</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (compositePayment.paymentUrl) {
                      window.open(compositePayment.paymentUrl, "_blank");
                    }
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Mở lại trang thanh toán
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    if (pollingIntervalRef.current) {
                      clearInterval(pollingIntervalRef.current);
                      pollingIntervalRef.current = null;
                    }
                    setShowQrCode(false);
                    setCompositePayment(null);
                  }}
                >
                  Hủy
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang chờ xác nhận thanh toán...</span>
              </div>
            </div>
          </div>
        ) : fetching ? (
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
              <p className="text-lg font-bold text-blue-700">{appointment.patientName || "Bệnh nhân"}</p>
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
              
              {/* Thông báo có đơn thuốc */}
              {appointment.status === AppointmentStatus.COMPLETED && appointment.prescriptionId && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Printer className="h-4 w-4" />
                    <p className="text-sm font-medium">
                      Có đơn thuốc - Sẽ tự động mở dialog in sau khi thanh toán thành công
                    </p>
                  </div>
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

    {/* Prescription Print Dialog - Tự động hiển thị sau khi thanh toán thành công nếu có đơn thuốc */}
    <PrescriptionPrintDialog
      open={prescriptionDialogOpen}
      onOpenChange={(open) => {
        setPrescriptionDialogOpen(open);
        if (!open) {
          // Khi đóng dialog in đơn thuốc, đóng cả bulk payment dialog và gọi onSuccess
          onOpenChange(false);
          onSuccess?.();
        }
      }}
      prescriptionId={appointment.prescriptionId || null}
      onSuccess={() => {
        // Sau khi in xong, đóng cả 2 dialog
        setPrescriptionDialogOpen(false);
        onOpenChange(false);
        onSuccess?.();
      }}
    />
  </>
  );
}
