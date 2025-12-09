"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, Loader2, Calendar, User, Pill } from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import { toast } from "react-toastify";
import { PrescriptionDetail, PrescriptionStatus, PrescriptionItem } from "@/types/medicine";
import { format } from "date-fns";

interface PrescriptionPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescriptionId: string | null;
  onSuccess?: () => void;
}

export function PrescriptionPrintDialog({
  open,
  onOpenChange,
  prescriptionId,
  onSuccess,
}: PrescriptionPrintDialogProps) {
  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionDetail | null>(null);

  // Fetch prescription details when dialog opens
  useEffect(() => {
    if (open && prescriptionId) {
      fetchPrescription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prescriptionId]);

  const fetchPrescription = async () => {
    if (!prescriptionId) return;

    try {
      setLoading(true);
      const data = await medicineService.getPrescriptionById(prescriptionId);
      setPrescription(data);
    } catch (error) {
      console.error("Lỗi tải đơn thuốc:", error);
      toast.error("Không thể tải thông tin đơn thuốc");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!prescription) return;

    try {
      setPrinting(true);

      // Mark as printed in backend
      await medicineService.markAsPrinted(prescription.id);

      // Trigger browser print dialog
      window.print();

      toast.success("Đã đánh dấu đơn thuốc là đã in");
      
      // Call success callback
      onSuccess?.();
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Lỗi in đơn thuốc:", error);
      toast.error("Không thể in đơn thuốc");
    } finally {
      setPrinting(false);
    }
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    const statusMap: Record<PrescriptionStatus, { label: string; className: string }> = {
      [PrescriptionStatus.DRAFT]: { label: "Nháp", className: "bg-gray-500" },
      [PrescriptionStatus.ACTIVE]: { label: "Chưa in", className: "bg-blue-500" },
      [PrescriptionStatus.PRINTED]: { label: "Đã in", className: "bg-green-500" },
      [PrescriptionStatus.CANCELLED]: { label: "Đã hủy", className: "bg-red-500" },
    };

    const statusInfo = statusMap[status];
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            In đơn thuốc
          </DialogTitle>
          <DialogDescription>
            Xem trước và in đơn thuốc cho bệnh nhân
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : prescription ? (
          <div className="space-y-4">
            {/* Prescription Header */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Đơn thuốc</h3>
                  <p className="text-sm text-muted-foreground">
                    Mã: {prescription.id.slice(0, 16)}...
                  </p>
                </div>
                {getStatusBadge(prescription.status)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Bệnh nhân</p>
                    <p className="font-medium">{prescription.patientName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Bác sĩ kê đơn</p>
                    <p className="font-medium">{prescription.doctorName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Ngày kê đơn</p>
                    <p className="font-medium">
                      {format(new Date(prescription.createdAt), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Chẩn đoán</p>
                    <p className="font-medium">{prescription.diagnosis || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Prescription Items */}
            <div>
              <h4 className="font-semibold mb-3">Danh sách thuốc</h4>
              <div className="space-y-3">
                {prescription.items.map((item: PrescriptionItem, index: number) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            #{index + 1}
                          </span>
                          <h5 className="font-semibold">{item.drugName}</h5>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div>
                            <span className="text-muted-foreground">Liều lượng: </span>
                            <span className="font-medium">{item.dosage}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Số lượng: </span>
                            <span className="font-medium">{item.quantity || "N/A"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Hướng dẫn: </span>
                            <span className="font-medium">{item.instructions || item.frequency}</span>
                          </div>
                        </div>

                        {item.notes && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Ghi chú: </span>
                            <span className="italic">{item.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {prescription.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Ghi chú</h4>
                  <p className="text-sm text-muted-foreground">{prescription.notes}</p>
                </div>
              </>
            )}

            {/* Important Notice */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded">
              <p className="text-sm font-medium text-orange-800">
                ⚠️ Lưu ý: Đơn thuốc chỉ có giá trị mua tại các nhà thuốc liên kết.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Không tìm thấy thông tin đơn thuốc
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={printing}
          >
            Đóng
          </Button>
          <Button
            onClick={handlePrint}
            disabled={!prescription || printing || prescription.status === PrescriptionStatus.CANCELLED}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {printing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang in...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                In đơn thuốc
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
