"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { billingService, type CashPaymentRequest, type PaymentType } from "@/services/billing.service";

interface CashPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId?: string;
  defaultAmount?: number;
  onSuccess?: () => void;
}

export function CashPaymentDialog({
  open,
  onOpenChange,
  appointmentId = "",
  defaultAmount = 200000,
  onSuccess,
}: CashPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    referenceId: appointmentId,
    amount: defaultAmount,
    paymentType: "APPOINTMENT_FEE" as PaymentType,
    notes: "",
  });

  const [errors, setErrors] = useState<{
    referenceId?: string;
    amount?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.referenceId || formData.referenceId.trim() === "") {
      newErrors.referenceId = "Vui lòng nhập mã tham chiếu (Appointment ID, Lab Test ID, v.v.)";
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Số tiền phải lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const request: CashPaymentRequest = {
        referenceId: formData.referenceId.trim(),
        amount: formData.amount,
        paymentType: formData.paymentType,
        notes: formData.notes.trim() || undefined,
      };

      const payment = await billingService.createCashPayment(request);

      toast.success(`Thanh toán thành công! Mã: ${payment.paymentCode}`);
      
      // Reset form
      setFormData({
        referenceId: "",
        amount: 200000,
        paymentType: "APPOINTMENT_FEE",
        notes: "",
      });
      setErrors({});

      // Close dialog
      onOpenChange(false);

      // Notify parent
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Cash payment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo thanh toán";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset errors when closing
        setErrors({});
      }
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("vi-VN") + " ₫";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Thanh toán tiền mặt
          </DialogTitle>
          <DialogDescription>
            Tạo phiếu thanh toán tiền mặt tại quầy lễ tân
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reference ID */}
          <div className="space-y-2">
            <Label htmlFor="referenceId">
              Mã tham chiếu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="referenceId"
              placeholder="Appointment ID, Lab Test ID, v.v."
              value={formData.referenceId}
              onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
              className={errors.referenceId ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.referenceId && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.referenceId}
              </p>
            )}
          </div>

          {/* Payment Type */}
          <div className="space-y-2">
            <Label htmlFor="paymentType">
              Loại thanh toán <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => setFormData({ ...formData, paymentType: value as PaymentType })}
              disabled={isSubmitting}
            >
              <SelectTrigger id="paymentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPOINTMENT_FEE">Phí khám bệnh</SelectItem>
                <SelectItem value="LAB_TEST">Xét nghiệm</SelectItem>
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Số tiền (VNĐ) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                min="0"
                step="1000"
                placeholder="200000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className={errors.amount ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                ₫
              </div>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.amount}
              </p>
            )}
            {formData.amount > 0 && !errors.amount && (
              <p className="text-sm text-muted-foreground">
                = {formatCurrency(formData.amount)}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú về thanh toán..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {/* Preview */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại:</span>
                <span className="font-medium">
                  {formData.paymentType === "APPOINTMENT_FEE" && "Phí khám bệnh"}
                  {formData.paymentType === "LAB_TEST" && "Xét nghiệm"}
                  {formData.paymentType === "OTHER" && "Khác"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số tiền:</span>
                <span className="font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(formData.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phương thức:</span>
                <span className="font-medium">Tiền mặt</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Xác nhận
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}