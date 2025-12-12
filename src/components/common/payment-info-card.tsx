"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import type { AppointmentDetail } from "@/types/appointment/appointment.type";
import { PaymentMethodDialog } from "./payment-method-dialog";
import { PaymentCountdown } from "./payment-countdown";

interface PaymentInfoCardProps {
  appointment: AppointmentDetail;
  onPaymentCreated?: () => void;
}

export function PaymentInfoCard({
  appointment,
  onPaymentCreated,
}: PaymentInfoCardProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  const handlePaymentSuccess = (url: string, paymentId: string) => {
    toast.success("Tạo yêu cầu thanh toán thành công!");
    toast.info("Vui lòng hoàn tất thanh toán trong 15 phút", {
      autoClose: 5000,
    });

    setShowPaymentDialog(false);

    // Notify parent to refresh data
    if (onPaymentCreated) {
      onPaymentCreated();
    }
  };

  const handleCreatePayment = () => {
    setIsCreatingPayment(true);
    setShowPaymentDialog(true);
    setIsCreatingPayment(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // UNPAID: Hiện nút thanh toán
  if (appointment.paymentStatus === "UNPAID") {
    return (
      <>
        <div className="flex flex-col gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleCreatePayment}
            disabled={isCreatingPayment}
            className="self-start bg-emerald-600 hover:bg-emerald-700"
          >
            {isCreatingPayment ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Thanh toán ngay
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            💡 Thanh toán trước để tiết kiệm thời gian
          </p>
        </div>

        <PaymentMethodDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          appointmentId={appointment.id}
          amount={appointment.consultationFee || 200000}
          onSuccess={handlePaymentSuccess}
        />
      </>
    );
  }

  // PENDING: Hiện trạng thái chờ + link tiếp tục thanh toán + nút tạo mới
  if (appointment.paymentStatus === "PENDING") {
    return (
      <>
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="p-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-3">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Đang chờ thanh toán</span>
            </div>






            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={handleCreatePayment}
                disabled={isCreatingPayment}
                className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/20"
              >
                {isCreatingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Tạo link mới
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        <PaymentMethodDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          appointmentId={appointment.id}
          amount={appointment.consultationFee || 200000}
          onSuccess={handlePaymentSuccess}
        />
      </>
    );
  }

  // PAID: Hiện thông tin đã thanh toán
  if (appointment.paymentStatus === "PAID") {
    return (
      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Đã thanh toán</span>
            </div>
            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              {(appointment.paidAmount || 0).toLocaleString("vi-VN")} ₫
            </span>
          </div>
          {appointment.paidAt && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {formatDateTime(appointment.paidAt)}
            </p>
          )}
          {appointment.checkedInAt && (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800">
              <UserCheck className="h-4 w-4" />
              <span className="text-xs">
                Đã check-in: {formatDateTime(appointment.checkedInAt)}
              </span>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // REFUNDED: Hiện thông tin hoàn tiền
  if (appointment.paymentStatus === "REFUNDED") {
    return (
      <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
        <div className="p-3">
          <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Đã hoàn tiền</span>
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Số tiền đã được hoàn về tài khoản của bạn
          </p>
        </div>
      </Card>
    );
  }

  return null;
}
