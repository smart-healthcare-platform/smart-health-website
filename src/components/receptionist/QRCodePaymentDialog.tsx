"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, QrCode, AlertCircle } from "lucide-react";
import { billingService, PaymentResponse, PaymentStatus } from "@/services/billing.service";
import Image from "next/image";

interface QRCodePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentResponse;
  onSuccess?: () => void;
}

export default function QRCodePaymentDialog({
  open,
  onOpenChange,
  payment,
  onSuccess,
}: QRCodePaymentDialogProps) {
  const [status, setStatus] = useState<PaymentStatus>(payment.status);
  const [polling, setPolling] = useState(true);

  // Polling để kiểm tra trạng thái thanh toán
  useEffect(() => {
    if (!open || status === "COMPLETED") {
      setPolling(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const currentStatus = await billingService.checkPaymentStatus(payment.id);
        setStatus(currentStatus);

        if (currentStatus === "COMPLETED") {
          setPolling(false);
          setTimeout(() => {
            onSuccess?.();
            onOpenChange(false);
          }, 2000); // Đợi 2s để user thấy success message
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 3000); // Poll mỗi 3 giây

    // Stop polling sau 5 phút (timeout)
    const timeout = setTimeout(() => {
      setPolling(false);
      if (status === "PENDING") {
        setStatus("FAILED");
      }
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open, status, payment.id, onSuccess, onOpenChange]);

  const getMethodName = () => {
    switch (payment.paymentMethod) {
      case "MOMO":
        return "Ví MoMo";
      case "VNPAY":
        return "VNPay";
      default:
        return payment.paymentMethod;
    }
  };

  const handleOpenPaymentUrl = () => {
    if (payment.paymentUrl) {
      window.open(payment.paymentUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Thanh toán qua {getMethodName()}
          </DialogTitle>
          <DialogDescription>
            Mã thanh toán: <span className="font-semibold">{payment.paymentCode}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Trạng thái */}
          {status === "COMPLETED" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <span className="font-semibold">Thanh toán thành công!</span>
                <br />
                Giao dịch đã được xác nhận.
              </AlertDescription>
            </Alert>
          )}

          {status === "PENDING" && polling && (
            <Alert className="border-blue-200 bg-blue-50">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <AlertDescription className="text-blue-800">
                Đang chờ thanh toán...
              </AlertDescription>
            </Alert>
          )}

          {status === "FAILED" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <span className="font-semibold">Thanh toán thất bại</span>
                <br />
                Vui lòng thử lại hoặc chọn phương thức khác.
              </AlertDescription>
            </Alert>
          )}

          {/* QR Code */}
          {payment.qrCodeUrl && status !== "COMPLETED" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-64 h-64 border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                <Image
                  src={payment.qrCodeUrl}
                  alt="QR Code"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Quét mã QR bằng ứng dụng {getMethodName()} để thanh toán
              </p>
            </div>
          )}

          {/* Thông tin thanh toán */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Số tiền:</span>
              <span className="font-semibold text-lg">
                {payment.amount?.toLocaleString("vi-VN") || "0"} ₫
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phương thức:</span>
              <span className="font-medium">{getMethodName()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trạng thái:</span>
              <span
                className={`font-medium ${
                  status === "COMPLETED"
                    ? "text-green-600"
                    : status === "PENDING"
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {status === "COMPLETED"
                  ? "Đã thanh toán"
                  : status === "PENDING"
                  ? "Đang chờ"
                  : "Thất bại"}
              </span>
            </div>
          </div>

          {/* Hướng dẫn */}
          {status === "PENDING" && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-semibold">Hướng dẫn thanh toán:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Mở ứng dụng {getMethodName()} trên điện thoại</li>
                <li>Chọn chức năng quét mã QR</li>
                <li>Quét mã QR hiển thị ở trên</li>
                <li>Xác nhận thanh toán trên ứng dụng</li>
              </ol>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {payment.paymentUrl && status === "PENDING" && (
            <Button variant="outline" onClick={handleOpenPaymentUrl}>
              Mở link thanh toán
            </Button>
          )}
          <Button
            variant={status === "COMPLETED" ? "default" : "outline"}
            onClick={() => onOpenChange(false)}
          >
            {status === "COMPLETED" ? "Hoàn tất" : "Đóng"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
