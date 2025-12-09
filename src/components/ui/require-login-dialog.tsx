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
import { useRouter } from "next/navigation";

interface LoginRequiredDialogProps {
  open: boolean;
  onClose: () => void;
  redirectPath?: string;
  onConfirm?: () => void;
}

export default function LoginRequiredDialog({
  open,
  onClose,
  redirectPath = "/",
  onConfirm
}: LoginRequiredDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      router.push(`/login?redirect=${redirectPath}`);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cần đăng nhập</DialogTitle>
          <DialogDescription>
            Bạn cần đăng nhập để tiếp tục.
            Vui lòng đăng nhập để trải nghiệm đầy đủ tính năng.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleLogin}>Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
