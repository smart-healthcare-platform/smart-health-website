"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, User, Pill, FileText } from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import { PrescriptionDetail, PrescriptionStatus, PrescriptionItem } from "@/types/medicine";
import { format } from "date-fns";
import Loading from "@/components/ui/loading";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const prescriptionId = params.id as string;

  const [prescription, setPrescription] = useState<PrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prescriptionId) {
      fetchPrescription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptionId]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getPrescriptionById(prescriptionId);
      setPrescription(data);
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

  if (!prescription) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Không tìm thấy đơn thuốc</p>
        <Button
          variant="outline"
          onClick={() => router.push("/user/prescriptions")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/user/prescriptions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Chi tiết đơn thuốc</h1>
          <p className="text-muted-foreground">Thông tin chi tiết về đơn thuốc</p>
        </div>
      </div>

      {/* Prescription Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin đơn thuốc
            </CardTitle>
            {getStatusBadge(prescription.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mã đơn thuốc</p>
                <p className="font-medium">{prescription.id.slice(0, 20)}...</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ngày kê đơn</p>
                <p className="font-medium">
                  {format(new Date(prescription.createdAt), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bác sĩ kê đơn</p>
                <p className="font-medium">{prescription.doctorName || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Pill className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chẩn đoán</p>
                <p className="font-medium">{prescription.diagnosis || "N/A"}</p>
              </div>
            </div>
          </div>

          {prescription.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ghi chú của bác sĩ</p>
                <p className="text-sm">{prescription.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Prescription Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Danh sách thuốc ({prescription.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prescription.items.map((item: PrescriptionItem, index: number) => (
              <div
                key={item.id || index}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{item.drugName || `Thuốc #${index + 1}`}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Liều lượng: </span>
                        <span className="font-medium">{item.dosage}</span>
                      </div>
                      
                      {item.quantity && (
                        <div>
                          <span className="text-muted-foreground">Số lượng: </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                      )}
                      
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Hướng dẫn sử dụng: </span>
                        <span className="font-medium">
                          {item.instructions || item.frequency || "Theo chỉ dẫn bác sĩ"}
                        </span>
                      </div>

                      {item.notes && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Ghi chú: </span>
                          <span className="italic text-sm">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <h4 className="font-semibold text-orange-800 mb-2">⚠️ Lưu ý quan trọng</h4>
              <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                <li>Đơn thuốc chỉ có giá trị mua tại các nhà thuốc liên kết của hệ thống</li>
                <li>Vui lòng mang đơn thuốc đã in (lấy tại quầy lễ tân) khi đến nhà thuốc</li>
                <li>Tuân thủ liều lượng và hướng dẫn sử dụng của bác sĩ</li>
                <li>Liên hệ bác sĩ nếu có bất kỳ thắc mắc nào về đơn thuốc</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
