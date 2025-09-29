"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { motion } from "framer-motion"

interface ErrorDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  message: string
  onRetry?: () => void
  retryText?: string
}

export default function ErrorDialog({
  open,
  onClose,
  title = "Có lỗi xảy ra!",
  message,
  onRetry,
  retryText = "Thử lại",
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl p-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50" />

        <div className="relative flex flex-col items-center text-center p-8 space-y-6">
          {/* Icon with shake animation */}
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
              className="relative z-10 w-20 h-20 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  ease: "easeInOut",
                }}
              >
                <XCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
              </motion.div>
            </motion.div>

            {/* Pulsing rings */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border-2 border-red-300"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-full border border-red-200"
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
            <p className="text-gray-600 text-base leading-relaxed max-w-sm">{message}</p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col gap-3 w-full pt-2"
          >
            {onRetry && (
              <Button
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {retryText}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 font-medium py-3 rounded-2xl transition-all duration-200"
            >
              Đóng
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
