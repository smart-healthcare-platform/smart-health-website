"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye } from "lucide-react";
import AppointmentDetailDialog from "../../../../../components/common/appointment-detail-dialog";

import { AppointmentStatus } from "@/types/appointment/enums/appointment-status.enum";
import { createConversation } from "@/services/chat.service";
import { RootState } from "@/redux";
import { PaymentStatusBadge } from "@/components/common/payment-status-badge";
import { PaymentInfoCard } from "@/components/common/payment-info-card";
import { AppointmentDetail } from "@/types/appointment/appointment.type";

interface AppointmentCardProps {
  appointment: AppointmentDetail;
  onPaymentCreated?: () => void;
}

export default function AppointmentCard({
  appointment,
  onPaymentCreated,
}: AppointmentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleStartChat = async () => {
    if (!user?.id || !appointment.doctorId) {
      console.error("Thiếu user ID hoặc doctor ID");
      return;
    }

    try {
      const newConversation = await createConversation({
        recipientId: appointment.doctorId,
        recipientRole: "doctor",
      });

      console.log("Conversation created:", newConversation);
      router.push(`/user/chat-history?conversationId=${newConversation.id}`);
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Đã hoàn thành", className: "bg-green-500 text-white" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", className: "bg-blue-500 text-white" };
      case "pending":
        return { label: "Chờ xác nhận", className: "bg-yellow-500 text-white" };
      case "in-progress":
        return { label: "Đang khám", className: "bg-purple-500 text-white" };
      case "cancelled":
        return { label: "Đã hủy", className: "bg-red-500 text-white" };
      case "no-show":
        return { label: "Không đến", className: "bg-gray-500 text-white" };
      default:
        return { label: "Không xác định", className: "bg-gray-400 text-white" };
    }
  };

  // 👉 Format ngày & giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = getStatusConfig(appointment.status);

  return (
    <>
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              {/* <div className="flex items-center gap-2 mb-2">
                <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                <Badge variant="outline">{appointment.type}</Badge>
                {appointment.paymentStatus && (
                  <PaymentStatusBadge status={appointment.paymentStatus} />
                )}
              </div> */}
              <h3 className="text-lg font-semibold text-foreground">
                {appointment.doctorName}
              </h3>
            </div>

            {/* Nút xem chi tiết */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="bg-transparent"
            >
              <Eye className="h-4 w-4 mr-2 text-primary" />
              Chi tiết
            </Button>
          </div>

          {/* Thông tin ngày giờ */}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(appointment.startAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{formatTime(appointment.startAt)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-4">
            <PaymentInfoCard
              appointment={appointment}
              onPaymentCreated={onPaymentCreated}
            />
          </div>

          {/* Nút chat */}
          <div className="flex flex-col gap-2 mt-4">
            {(appointment.status === AppointmentStatus.COMPLETED ||
              appointment.status === AppointmentStatus.CONFIRMED) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartChat}
                  className="self-start"
                >
                  Bắt đầu trò chuyện
                </Button>
              )}
          </div>
        </div>
      </Card>

      <AppointmentDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        appointment={appointment}
      />
    </>
  );
}
