"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface ConfirmEndExaminationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmEndExaminationDialog({
  open,
  onClose,
  onConfirm,
}: ConfirmEndExaminationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-0 overflow-hidden">
        {/* Title for accessibility */}
        <DialogTitle className="sr-only">Xác nhận kết thúc buổi khám</DialogTitle>

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50" />

        <div className="relative flex flex-col items-center text-center p-8 space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="relative z-10 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Xác nhận kết thúc buổi khám
            </h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm">
              Bác sĩ có chắc chắn muốn <strong>kết thúc buổi khám</strong> và{" "}
              <strong>lưu thông tin bệnh án</strong> của bệnh nhân không?
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col gap-3 w-full pt-2"
          >
            <Button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Xác nhận và lưu
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 font-medium py-3 rounded-2xl transition-all duration-200"
            >
              Hủy
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
