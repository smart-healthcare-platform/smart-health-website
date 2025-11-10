import { Badge } from "@/components/ui/badge"
import { LabTestOrderStatus } from "@/types/examnation/enums/lab-test-order-status.enum"

interface TestStatusBadgeProps {
  status: LabTestOrderStatus
}

const STATUS_CONFIG: Record<
  LabTestOrderStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  [LabTestOrderStatus.ORDERED]: {
    label: "Đã chỉ định",
    variant: "secondary",
  },
  [LabTestOrderStatus.IN_PROGRESS]: {
    label: "Đang thực hiện",
    variant: "default",
  },
  [LabTestOrderStatus.COMPLETED]: {
    label: "Hoàn thành",
    variant: "outline",
  },
  [LabTestOrderStatus.CANCELLED]: {
    label: "Đã hủy",
    variant: "destructive",
  },
}

export function TestStatusBadge({ status }: TestStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
