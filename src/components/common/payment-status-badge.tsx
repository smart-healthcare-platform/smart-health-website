"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, CreditCard, RefreshCw } from "lucide-react"
import type { PaymentStatus } from "@/types/appointment"

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = getPaymentStatusConfig(status)

  return (
    <Badge className={`${config.className} ${className || ""}`}>
      {config.icon}
      <span className="ml-1">{config.label}</span>
    </Badge>
  )
}

function getPaymentStatusConfig(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return {
        label: "Đã thanh toán",
        className: "bg-emerald-500 text-white hover:bg-emerald-600",
        icon: <CheckCircle className="h-3 w-3" />,
      }
    case "PENDING":
      return {
        label: "Chờ thanh toán",
        className: "bg-amber-500 text-white hover:bg-amber-600",
        icon: <Clock className="h-3 w-3" />,
      }
    case "UNPAID":
      return {
        label: "Chưa thanh toán",
        className: "bg-gray-400 text-white hover:bg-gray-500",
        icon: <CreditCard className="h-3 w-3" />,
      }
    case "REFUNDED":
      return {
        label: "Đã hoàn tiền",
        className: "bg-purple-500 text-white hover:bg-purple-600",
        icon: <RefreshCw className="h-3 w-3" />,
      }
    default:
      return {
        label: "Không xác định",
        className: "bg-gray-300 text-gray-700",
        icon: <CreditCard className="h-3 w-3" />,
      }
  }
}
