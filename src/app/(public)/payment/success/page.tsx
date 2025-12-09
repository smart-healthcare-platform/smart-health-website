"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Home, FileText, Loader2, ArrowLeft } from "lucide-react";
import { RootState } from "@/redux";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "success" | "failed" | "pending">("loading");
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    amount?: string;
    transId?: string;
    message?: string;
    partnerCode?: string;
    orderInfo?: string;
  }>({});

  useEffect(() => {
    // Parse query parameters
    const resultCode = searchParams.get("resultCode");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const transId = searchParams.get("transId");
    const message = searchParams.get("message");
    const partnerCode = searchParams.get("partnerCode");
    const orderInfo = searchParams.get("orderInfo");

    // Store payment details
    setPaymentDetails({
      orderId: orderId || undefined,
      amount: amount || undefined,
      transId: transId || undefined,
      message: message || undefined,
      partnerCode: partnerCode || undefined,
      orderInfo: orderInfo ? decodeURIComponent(orderInfo) : undefined,
    });

    // Determine payment status based on resultCode
    // MoMo: resultCode = 0 means success
    // VNPay: vnp_ResponseCode = 00 means success
    const vnpayResponseCode = searchParams.get("vnp_ResponseCode");
    
    if (resultCode === "0" || vnpayResponseCode === "00") {
      setPaymentStatus("success");
    } else if (resultCode === "1000" || resultCode === "1001") {
      // MoMo pending codes
      setPaymentStatus("pending");
    } else {
      setPaymentStatus("failed");
    }
  }, [searchParams]);

  // Determine home path based on user role
  const getHomePath = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case "RECEPTIONIST":
        return "/receptionist/check-in";
      case "DOCTOR":
        return "/doctor/dashboard";
      case "ADMIN":
        return "/admin/dashboard";
      case "PATIENT":
      default:
        return "/";
    }
  };

  // Determine appointments path based on user role
  const getAppointmentsPath = () => {
    if (!user) return "/user/appointment-history";
    
    switch (user.role) {
      case "RECEPTIONIST":
        return "/receptionist/check-in";
      case "DOCTOR":
        return "/doctor/appointments";
      case "PATIENT":
      default:
        return "/user/appointment-history";
    }
  };

  const handleGoHome = () => {
    router.push(getHomePath());
  };

  const handleViewAppointments = () => {
    router.push(getAppointmentsPath());
  };

  const formatAmount = (amount?: string) => {
    if (!amount) return "0 ₫";
    return parseInt(amount).toLocaleString("vi-VN") + " ₫";
  };

  const getPaymentMethodName = (partnerCode?: string) => {
    if (partnerCode?.includes("MOMO")) return "Ví MoMo";
    if (partnerCode?.includes("VNPAY")) return "VNPay";
    return "Cổng thanh toán";
  };

  // Get button labels based on role
  const getButtonLabels = () => {
    if (user?.role === "RECEPTIONIST") {
      return {
        primary: "Quay lại danh sách",
        secondary: "Về trang làm việc",
        primaryIcon: ArrowLeft,
        secondaryIcon: Home,
      };
    }
    return {
      primary: "Xem lịch hẹn",
      secondary: "Về trang chủ",
      primaryIcon: FileText,
      secondaryIcon: Home,
    };
  };

  const buttonLabels = getButtonLabels();

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="h-16 w-16 mx-auto mb-4 text-emerald-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang xác nhận thanh toán...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600">
              Giao dịch của bạn đã được xử lý thành công
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền</span>
              <span className="text-2xl font-bold text-emerald-600">
                {formatAmount(paymentDetails.amount)}
              </span>
            </div>

            {paymentDetails.orderId && (
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-gray-600">Mã đơn hàng</span>
                <span className="font-mono text-sm text-gray-900">
                  {paymentDetails.orderId.length > 20 
                    ? `${paymentDetails.orderId.slice(0, 20)}...`
                    : paymentDetails.orderId}
                </span>
              </div>
            )}

            {paymentDetails.transId && (
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-gray-600">Mã giao dịch</span>
                <span className="font-mono text-sm text-gray-900">
                  {paymentDetails.transId}
                </span>
              </div>
            )}

            {paymentDetails.partnerCode && (
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-gray-600">Phương thức</span>
                <span className="font-medium text-gray-900">
                  {getPaymentMethodName(paymentDetails.partnerCode)}
                </span>
              </div>
            )}

            {paymentDetails.orderInfo && (
              <div className="flex justify-between items-start border-t pt-3">
                <span className="text-gray-600">Thông tin</span>
                <span className="text-sm text-gray-900 text-right max-w-xs">
                  {paymentDetails.orderInfo}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-gray-600">Trạng thái</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Đã thanh toán
              </span>
            </div>
          </div>

          {user?.role !== "RECEPTIONIST" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Vui lòng đến đúng giờ hẹn và mang theo giấy tờ tùy thân. 
                Bạn có thể kiểm tra chi tiết lịch hẹn trong mục "Lịch sử đặt khám".
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleViewAppointments}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <buttonLabels.primaryIcon className="h-4 w-4 mr-2" />
              {buttonLabels.primary}
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1"
            >
              <buttonLabels.secondaryIcon className="h-4 w-4 mr-2" />
              {buttonLabels.secondary}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-4">
              <Clock className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thanh toán đang xử lý
            </h1>
            <p className="text-gray-600">
              Giao dịch của bạn đang được xác nhận
            </p>
          </div>

          <div className="bg-amber-50 rounded-lg p-6 mb-6">
            <p className="text-amber-800 mb-4">
              Giao dịch của bạn đang được xử lý. Chúng tôi sẽ thông báo kết quả qua email/SMS khi có cập nhật.
            </p>

            {paymentDetails.orderId && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono text-gray-900">
                    {paymentDetails.orderId.length > 20 
                      ? `${paymentDetails.orderId.slice(0, 20)}...`
                      : paymentDetails.orderId}
                  </span>
                </div>
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-gray-900">
                      {formatAmount(paymentDetails.amount)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleViewAppointments}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              <buttonLabels.primaryIcon className="h-4 w-4 mr-2" />
              {buttonLabels.primary}
            </Button>
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="flex-1"
            >
              <buttonLabels.secondaryIcon className="h-4 w-4 mr-2" />
              {buttonLabels.secondary}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Failed status
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-gray-600">
            {paymentDetails.message || "Giao dịch không thành công. Vui lòng thử lại."}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-6">
          {paymentDetails.orderId && (
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono text-gray-900">
                  {paymentDetails.orderId.length > 20 
                    ? `${paymentDetails.orderId.slice(0, 20)}...`
                    : paymentDetails.orderId}
                </span>
              </div>
            </div>
          )}

          <p className="text-red-800 text-sm">
            <strong>Có thể do:</strong>
          </p>
          <ul className="list-disc list-inside text-red-700 text-sm mt-2 space-y-1">
            <li>Số dư tài khoản không đủ</li>
            <li>Thông tin thanh toán không chính xác</li>
            <li>Giao dịch bị hủy bởi người dùng</li>
            <li>Phiên thanh toán đã hết hạn</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleViewAppointments}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <buttonLabels.primaryIcon className="h-4 w-4 mr-2" />
            Thử lại thanh toán
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1"
          >
            <buttonLabels.secondaryIcon className="h-4 w-4 mr-2" />
            {buttonLabels.secondary}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="h-16 w-16 mx-auto mb-4 text-emerald-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang tải...
          </h2>
        </Card>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}