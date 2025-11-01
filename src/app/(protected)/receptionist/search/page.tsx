"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, User, Calendar, Phone, CreditCard, UserCheck } from "lucide-react";
import { receptionistService } from "@/services/receptionist.service";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { CashPaymentDialog } from "@/components/receptionist/CashPaymentDialog";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const data = await receptionistService.searchAppointments(keyword.trim());
      setResults(data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      toast.error("Tìm kiếm thất bại");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      await receptionistService.checkInPatient(appointmentId);
      toast.success("Check-in thành công!");
      handleSearch(); // Re-search
    } catch (err) {
      console.error("Lỗi check-in:", err);
      toast.error("Check-in thất bại");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-500" },
      confirmed: { label: "Đã xác nhận", className: "bg-blue-500" },
      checked_in: { label: "Đã check-in", className: "bg-green-500" },
      "in-progress": { label: "Đang khám", className: "bg-purple-500" },
      completed: { label: "Hoàn thành", className: "bg-gray-500" },
      cancelled: { label: "Đã hủy", className: "bg-red-500" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      className: "bg-gray-500",
    };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (paymentStatus === "PAID") {
      return <Badge className="bg-green-500">Đã thanh toán</Badge>;
    }
    return <Badge className="bg-orange-500">Chưa thanh toán</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tìm kiếm lịch hẹn</h1>
        <p className="text-muted-foreground">
          Tìm theo tên bệnh nhân, mã lịch hẹn, hoặc ID bệnh nhân
        </p>
      </div>

      {/* Search Box */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nhập tên bệnh nhân, mã lịch hẹn, hoặc ID bệnh nhân..."
                className="pl-10"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {searched && (
        <Card>
          <CardHeader>
            <CardTitle>
              Kết quả tìm kiếm ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Không tìm thấy lịch hẹn nào
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Thử tìm với từ khóa khác
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((apt) => (
                  <div
                    key={apt.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {apt.patientName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                ID: {apt.patientId.slice(0, 12)}...
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {getStatusBadge(apt.status)}
                              {getPaymentBadge(apt.paymentStatus || "UNPAID")}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Bác sĩ: {apt.doctorName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {apt.startAt
                                  ? format(new Date(apt.startAt), "HH:mm - dd/MM/yyyy")
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-xs">
                                {apt.id.slice(0, 16)}...
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {apt.consultationFee
                                  ? `${apt.consultationFee.toLocaleString()} VNĐ`
                                  : "200,000 VNĐ"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            {apt.paymentStatus === "UNPAID" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 border-green-500/50"
                                onClick={() => {
                                  setSelectedAppointment(apt);
                                  setPaymentDialogOpen(true);
                                }}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Thu tiền
                              </Button>
                            )}

                            {apt.status !== "checked_in" &&
                              apt.status !== "in-progress" && (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleCheckIn(apt.id)}
                                  disabled={apt.paymentStatus === "UNPAID"}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Check-in
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cash Payment Dialog */}
      <CashPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        appointment={selectedAppointment}
        onSuccess={() => {
          handleSearch(); // Re-search to refresh
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}
