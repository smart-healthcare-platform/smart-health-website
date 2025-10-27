"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, User, Calendar, Loader2 } from "lucide-react";
import { receptionistService } from "@/services/receptionist.service";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { toast } from "react-toastify";

interface QuickCheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function QuickCheckInDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickCheckInDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Appointment[]>([]);
  const [searching, setSearching] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    try {
      setSearching(true);
      const data = await receptionistService.searchAppointments(keyword.trim());
      
      // Chỉ hiển thị appointments chưa check-in
      const unchecked = data.filter(
        (apt) =>
          apt.status === "confirmed" ||
          apt.status === "pending"
      );
      
      setResults(unchecked);
      
      if (unchecked.length === 0) {
        toast.info("Không tìm thấy lịch hẹn cần check-in");
      }
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      toast.error("Tìm kiếm thất bại");
    } finally {
      setSearching(false);
    }
  }, [keyword]);

  const handleCheckIn = async (appointment: Appointment) => {
    // ✅ BỎ VALIDATION PAYMENT - Cho phép check-in dù chưa thanh toán
    // Payment sẽ được thực hiện SAU KHI KHÁM
    
    try {
      setCheckingIn(appointment.id);
      const result = await receptionistService.checkInPatient(appointment.id);
      
      // ✅ Hiển thị thông báo dựa trên payment status
      if (result.paymentStatus !== "PAID") {
        toast.warning(
          `✅ Check-in thành công: ${appointment.patientName}\n⚠️ Lưu ý: Chưa thanh toán - Thu tiền sau khi khám`,
          { autoClose: 5000 }
        );
      } else {
        toast.success(
          `✅ Check-in thành công: ${appointment.patientName}\n💰 Đã thanh toán`
        );
      }
      
      // Remove from results
      setResults((prev) => prev.filter((apt) => apt.id !== appointment.id));
      
      // Reset if no more results
      if (results.length <= 1) {
        setKeyword("");
        setResults([]);
        onOpenChange(false);
      }
      
      onSuccess?.();
    } catch (err) {
      console.error("Lỗi check-in:", err);
      toast.error("Check-in thất bại");
    } finally {
      setCheckingIn(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClose = () => {
    setKeyword("");
    setResults([]);
    onOpenChange(false);
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (paymentStatus === "PAID") {
      return <Badge className="bg-green-500">Đã thanh toán</Badge>;
    }
    return <Badge className="bg-orange-500">Chưa thanh toán</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Check-in nhanh
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và check-in bệnh nhân nhanh chóng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nhập tên bệnh nhân, mã lịch hẹn..."
                className="pl-10"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {searching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tìm...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Tìm
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {keyword
                    ? "Không tìm thấy lịch hẹn. Thử từ khóa khác."
                    : "Nhập từ khóa để tìm kiếm"}
                </p>
              </div>
            ) : (
              results.map((apt) => (
                <div
                  key={apt.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {apt.patientName}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              ID: {apt.patientId.slice(0, 12)}...
                            </p>
                          </div>
                          {getPaymentBadge(apt.paymentStatus || "UNPAID")}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{apt.doctorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {apt.startAt
                                ? format(new Date(apt.startAt), "HH:mm")
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCheckIn(apt)}
                      disabled={checkingIn === apt.id}
                    >
                      {checkingIn === apt.id ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-3 w-3" />
                          Check-in
                        </>
                      )}
                    </Button>
                  </div>

                  {/* ✅ CHỈ HIỂN THỊ GỢI Ý, KHÔNG BLOCK */}
                  {apt.paymentStatus === "UNPAID" && (
                    <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2">
                      💡 Gợi ý: Thu tiền sau khi khám để tính đúng tổng chi phí
                    </div>
                  )}
                  
                  {/* ✅ HIỂN THỊ THỜI GIAN CHECK-IN NẾU ĐÃ CHECK-IN */}
                  {apt.checkedInAt && (
                    <div className="mt-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded p-2 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" />
                      <span>
                        Đã check-in lúc {format(new Date(apt.checkedInAt), "HH:mm dd/MM/yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
