"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Smartphone, Wallet, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { billingService, PaymentMethodType } from "@/services/billing.service";
import { appointmentService } from "@/services/appointment.service";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  patientName: string;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentMethodDialog({
  open,
  onOpenChange,
  appointmentId,
  patientName,
  amount,
  onSuccess,
}: PaymentMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>("CASH");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      value: "CASH" as PaymentMethodType,
      label: "Tiền mặt",
      icon: Wallet,
      description: "Thanh toán trực tiếp tại quầy",
      color: "text-green-600",
    },
    {
      value: "MOMO" as PaymentMethodType,
      label: "Ví MoMo",
      icon: Smartphone,
      description: "Quét mã QR để thanh toán",
      color: "text-pink-600",
    },
    {
      value: "VNPAY" as PaymentMethodType,
      label: "VNPay",
      icon: CreditCard,
      description: "Thanh toán qua VNPay QR",
      color: "text-blue-600",
    },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (selectedMethod === "CASH") {
        // Thanh toán tiền mặt ngay
        const response = await billingService.createCashPayment({
          referenceId: appointmentId,
          amount,
          paymentType: "APPOINTMENT_FEE",
          notes: notes || undefined,
        });

        toast.success(`Thanh toán tiền mặt thành công! Mã: ${response.paymentCode}`);

        onOpenChange(false);
        onSuccess?.();
      } else {
        // MOMO hoặc VNPAY - Tạo payment request
        const response = await appointmentService.createPayment(
          appointmentId,
          selectedMethod
        );

        // Mở payment URL trong tab mới
        window.open(response.paymentUrl, "_blank");

        toast.info("Đã tạo yêu cầu thanh toán! Vui lòng hoàn tất thanh toán trong tab mới.");

        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("[PaymentMethodDialog] Payment error:", error);
      toast.error(err?.response?.data?.message || "Không thể tạo thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
            <DialogDescription>
              Bệnh nhân: <span className="font-semibold">{patientName}</span>
              <br />
              Số tiền:{" "}
              <span className="font-semibold text-lg text-primary">
                {amount.toLocaleString("vi-VN")} ₫
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Phương thức thanh toán */}
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setSelectedMethod(method.value)}
                    className={`w-full flex items-start space-x-3 rounded-lg border-2 p-4 transition-all text-left ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-primary" : "border-gray-300"
                    }`}>
                      {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${method.color}`} />
                        <span className="font-semibold">{method.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {method.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ghi chú (chỉ hiện cho thanh toán tiền mặt) */}
            {selectedMethod === "CASH" && (
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ví dụ: Bệnh nhân đã thanh toán đầy đủ"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedMethod === "CASH" ? "Xác nhận thanh toán" : "Tạo yêu cầu thanh toán"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}
