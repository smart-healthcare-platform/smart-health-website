"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, CreditCard, Loader2 } from "lucide-react"
import { appointmentService } from "@/services/appointment.service"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: string
  amount: number
  onSuccess: (paymentUrl: string, paymentId: string) => void
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  appointmentId,
  amount,
  onSuccess,
}: PaymentMethodDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<"MOMO" | "VNPAY" | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleConfirm = async () => {
    if (!selectedMethod) return

    setIsCreating(true)
    try {
      const result = await appointmentService.createPayment(appointmentId, selectedMethod)
      
      toast.success("Đang chuyển đến cổng thanh toán...")
      
      // Notify parent component
      onSuccess(result.paymentUrl, result.paymentId)
      
      // Open payment URL in new tab
      window.open(result.paymentUrl, "_blank")
      
      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Payment creation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo yêu cầu thanh toán"
      toast.error(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Chọn phương thức thanh toán
          </DialogTitle>
          <DialogDescription>
            Phí khám bệnh: <span className="font-semibold text-foreground">{amount.toLocaleString("vi-VN")} ₫</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* MoMo Option */}
          <Card
            className={cn(
              "cursor-pointer border-2 transition-all hover:shadow-md",
              selectedMethod === "MOMO" ? "border-pink-500 bg-pink-50 dark:bg-pink-950/20" : "border-border hover:border-pink-300"
            )}
            onClick={() => setSelectedMethod("MOMO")}
          >
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Ví MoMo</p>
                <p className="text-sm text-muted-foreground">Thanh toán qua ví điện tử MoMo</p>
              </div>
              {selectedMethod === "MOMO" && <CheckCircle className="h-5 w-5 text-pink-500" />}
            </div>
          </Card>

          {/* VNPay Option */}
          <Card
            className={cn(
              "cursor-pointer border-2 transition-all hover:shadow-md",
              selectedMethod === "VNPAY" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-border hover:border-blue-300"
            )}
            onClick={() => setSelectedMethod("VNPAY")}
          >
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                VNPay
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">VNPay</p>
                <p className="text-sm text-muted-foreground">Thanh toán qua cổng VNPay</p>
              </div>
              {selectedMethod === "VNPAY" && <CheckCircle className="h-5 w-5 text-blue-500" />}
            </div>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedMethod || isCreating} className="min-w-[120px]">
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
