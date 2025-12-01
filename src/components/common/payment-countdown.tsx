"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentCountdownProps {
  expiredAt: string;
  onExpired?: () => void;
  className?: string;
}

export function PaymentCountdown({
  expiredAt,
  onExpired,
  className,
}: PaymentCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiredAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (onExpired && !isExpired) {
          onExpired();
        }
        return 0;
      }

      setTimeLeft(diff);
      setIsExpired(false);
      return diff;
    };

    // Initial calculation
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredAt, onExpired, isExpired]);

  const formatTime = (milliseconds: number): { minutes: number; seconds: number } => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(timeLeft);

  // Determine color based on time left
  const getColorClass = () => {
    if (isExpired) {
      return "text-red-600 dark:text-red-400";
    }
    if (timeLeft < 300000) {
      // Less than 5 minutes
      return "text-amber-600 dark:text-amber-400";
    }
    return "text-green-600 dark:text-green-400";
  };

  const getBackgroundClass = () => {
    if (isExpired) {
      return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
    }
    if (timeLeft < 300000) {
      // Less than 5 minutes
      return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
    }
    return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
  };

  if (isExpired) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border",
          getBackgroundClass(),
          className
        )}
      >
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Link thanh toán đã hết hạn
          </p>
          <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">
            Vui lòng tạo yêu cầu thanh toán mới
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        getBackgroundClass(),
        className
      )}
    >
      <Clock className={cn("h-4 w-4 flex-shrink-0", getColorClass())} />
      <div className="flex-1">
        <p className="text-sm font-medium">
          <span className={getColorClass()}>Còn lại: </span>
          <span className={cn("font-mono font-bold", getColorClass())}>
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </span>
        </p>
        {timeLeft < 300000 && !isExpired && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            ⚠️ Vui lòng hoàn tất thanh toán sớm
          </p>
        )}
      </div>
    </div>
  );
}