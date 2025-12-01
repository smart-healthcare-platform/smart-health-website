"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Calendar, User, FileText, ChevronRight } from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import { PrescriptionSummary, PrescriptionStatus } from "@/types/medicine";
import { format } from "date-fns";
import { RootState } from "@/redux";
import Loading from "@/components/ui/loading";

export default function PrescriptionsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const [prescriptions, setPrescriptions] = useState<PrescriptionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.referenceId) {
      fetchPrescriptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.referenceId]);

  const fetchPrescriptions = async () => {
    if (!user?.referenceId) return;

    try {
      setLoading(true);
      const data = await medicineService.getPrescriptionsByPatient(user.referenceId);
      setPrescriptions(data);
    } catch (error) {
      console.error("Lỗi tải đơn thuốc:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    const statusMap: Record<PrescriptionStatus, { label: string; className: string }> = {
      [PrescriptionStatus.DRAFT]: { label: "Nháp", className: "bg-gray-500" },
      [PrescriptionStatus.ACTIVE]: { label: "Chưa lấy", className: "bg-blue-500" },
      [PrescriptionStatus.PRINTED]: { label: "Đã lấy", className: "bg-green-500" },
      [PrescriptionStatus.CANCELLED]: { label: "Đã hủy", className: "bg-red-500" },
    };

    const statusInfo = statusMap[status];
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Pill className="h-6 w-6" />
          Đơn thuốc của tôi
        </h1>
        <p className="text-muted-foreground mt-1">
          Xem lại các đơn thuốc đã được bác sĩ kê
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng đơn</p>
                <p className="text-2xl font-bold">{prescriptions.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chưa lấy</p>
                <p className="text-2xl font-bold">
                  {prescriptions.filter((p) => p.status === PrescriptionStatus.ACTIVE).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã lấy</p>
                <p className="text-2xl font-bold">
                  {prescriptions.filter((p) => p.status === PrescriptionStatus.PRINTED).length}
                </p>
              </div>
              <Pill className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã hủy</p>
                <p className="text-2xl font-bold">
                  {prescriptions.filter((p) => p.status === PrescriptionStatus.CANCELLED).length}
                </p>
              </div>
              <User className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prescription List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn thuốc</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có đơn thuốc nào</p>
              <p className="text-sm text-muted-foreground mt-2">
                Đơn thuốc sẽ hiển thị sau khi bác sĩ kê đơn
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/user/prescriptions/${prescription.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{prescription.diagnosis || "Đơn thuốc"}</h3>
                          <p className="text-sm text-muted-foreground">
                            Mã: {prescription.id.slice(0, 16)}...
                          </p>
                        </div>
                        {getStatusBadge(prescription.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Ngày kê: {format(new Date(prescription.createdAt), "dd/MM/yyyy HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/user/prescriptions/${prescription.id}`);
                      }}
                    >
                      Xem chi tiết
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-orange-500 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Pill className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Lưu ý quan trọng</h4>
              <p className="text-sm text-orange-700">
                Đơn thuốc chỉ có giá trị mua tại các <strong>nhà thuốc liên kết</strong> của hệ thống.
                Vui lòng mang đơn thuốc đã in đến quầy lễ tân để nhận và đến nhà thuốc gần nhất để mua thuốc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
