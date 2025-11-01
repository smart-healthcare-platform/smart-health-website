"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Loader2 } from "lucide-react";
import { receptionistService } from "@/services/receptionist.service";
import { toast } from "react-toastify";
import { Appointment } from "@/types/appointment/appointment.type";

interface CashPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

export function CashPaymentDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: CashPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<
    "CONSULTATION" | "MEDICATION" | "PROCEDURE" | "OTHER"
  >("CONSULTATION");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState("");

  // Auto-fill amount when dialog opens
  useState(() => {
    if (appointment && open) {
      const defaultAmount = appointment.consultationFee || 200000;
      setAmount(defaultAmount.toString());
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointment) {
      toast.error("Không tìm thấy thông tin lịch hẹn");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      setLoading(true);

      await receptionistService.createCashPayment({
        appointmentId: appointment.id,
        paymentType,
        amount: parseFloat(amount),
        notes: notes.trim() || undefined,
      });

      toast.success("Thu tiền thành công!");
      
      // Reset form
      setAmount("");
      setNotes("");
      setPaymentType("CONSULTATION");
      
      // Close dialog và callback
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi thu tiền:", err);
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Thu tiền thất bại");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/\D/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("vi-VN");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setAmount(rawValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Thu tiền mặt
          </DialogTitle>
          <DialogDescription>
            Ghi nhận thanh toán bằng tiền mặt tại quầy lễ tân
          </DialogDescription>
        </DialogHeader>

        {appointment && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-sm mb-2">Thông tin bệnh nhân</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Họ tên:</span>{" "}
                <span className="font-medium">{appointment.patientName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Bác sĩ:</span>{" "}
                {appointment.doctorName}
              </p>
              <p>
                <span className="text-muted-foreground">Mã lịch hẹn:</span>{" "}
                <span className="font-mono text-xs">
                  {appointment.id.slice(0, 12)}...
                </span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentType">Loại thanh toán *</Label>
            <Select
              value={paymentType}
              onValueChange={(value) => setPaymentType(value as typeof paymentType)}
            >
              <SelectTrigger id="paymentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONSULTATION">
                  💊 Phí khám bệnh
                </SelectItem>
                <SelectItem value="MEDICATION">💉 Tiền thuốc</SelectItem>
                <SelectItem value="PROCEDURE">🩺 Phí thủ thuật</SelectItem>
                <SelectItem value="OTHER">📋 Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ) *</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder="200,000"
                value={formatCurrency(amount)}
                onChange={handleAmountChange}
                className="pr-12"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                VNĐ
              </span>
            </div>
            {amount && (
              <p className="text-xs text-muted-foreground">
                Số tiền:{" "}
                <span className="font-medium">
                  {formatCurrency(amount)} VNĐ
                </span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú nếu cần..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {notes.length}/500
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Xác nhận thu tiền
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
