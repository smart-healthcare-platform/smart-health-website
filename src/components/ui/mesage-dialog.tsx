"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageType = "success" | "error" | "info" | "warning";

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: MessageType;
  title?: string;
  onConfirm?: () => void;
}

export default function MessageDialog({
  open,
  onClose,
  message,
  type = "info",
  title,
  onConfirm,
}: MessageDialogProps) {
  const styles = {
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      bg: "bg-green-100",
      title: "Thành công",
      button: "bg-green-500 hover:bg-green-600 text-white",
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      bg: "bg-red-100",
      title: "Lỗi",
      button: "bg-red-500 hover:bg-red-600 text-white",
    },
    info: {
      icon: <Info className="w-12 h-12 text-blue-500" />,
      bg: "bg-blue-100",
      title: "Thông báo",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    warning: {
      icon: <AlertCircle className="w-12 h-12 text-yellow-500" />,
      bg: "bg-yellow-100",
      title: "Cảnh báo",
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
  };

  const current = styles[type];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg p-6 animate-in fade-in-50 zoom-in-95">
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            className={cn(
              "rounded-full p-3 flex items-center justify-center",
              current.bg
            )}
          >
            {current.icon}
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              {title || current.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-1">
              {message}
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="flex justify-center gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Đóng
          </Button>
          {onConfirm && (
            <Button
              onClick={onConfirm}
              className={cn("rounded-full px-6", current.button)}
            >
              Xác nhận
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
