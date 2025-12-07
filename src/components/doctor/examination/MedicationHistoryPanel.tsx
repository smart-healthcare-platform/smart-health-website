import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pill,
  Calendar,
  TrendingUp,
  History,
  ChevronDown,
  ChevronUp,
  Copy,
  Activity,
} from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import { MedicationHistory, DrugFrequency, PrescriptionStatus } from "@/types/medicine";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MedicationHistoryPanelProps {
  patientId: string;
  onCopyPrescription?: (history: MedicationHistory) => void;
}

export function MedicationHistoryPanel({
  patientId,
  onCopyPrescription,
}: MedicationHistoryPanelProps) {
  const [history, setHistory] = useState<MedicationHistory[]>([]);
  const [drugFrequency, setDrugFrequency] = useState<DrugFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [historyData, frequencyData] = await Promise.all([
        medicineService.getPatientMedicationHistory(patientId, 6), // Last 6 months
        medicineService.getPatientDrugFrequency(patientId),
      ]);
      setHistory(historyData);
      setDrugFrequency(frequencyData.slice(0, 5)); // Top 5 drugs
    } catch (error) {
      console.error("Lỗi tải lịch sử dùng thuốc:", error);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) {
      fetchData();
    }
  }, [patientId, fetchData]);

  const getStatusBadge = (status: PrescriptionStatus) => {
    const statusMap: Record<
      PrescriptionStatus,
      { label: string; className: string }
    > = {
      [PrescriptionStatus.DRAFT]: { label: "Nháp", className: "bg-gray-500" },
      [PrescriptionStatus.ACTIVE]: {
        label: "Chưa in",
        className: "bg-blue-500",
      },
      [PrescriptionStatus.PRINTED]: {
        label: "Đã in",
        className: "bg-green-500",
      },
      [PrescriptionStatus.CANCELLED]: {
        label: "Đã hủy",
        className: "bg-red-500",
      },
    };

    const statusInfo = statusMap[status];
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const displayedHistory = showAll ? history : history.slice(0, 3);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <Activity className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drug Frequency Statistics */}
      {drugFrequency.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              Thuốc thường dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drugFrequency.map((drug) => (
                <div
                  key={drug.drugId}
                  className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{drug.drugName}</p>
                    <p className="text-xs text-muted-foreground">
                      {drug.activeIngredient} - {drug.strength}
                    </p>
                  </div>
                  <Badge variant="secondary">{drug.prescriptionCount}x</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medication History Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              Lịch sử kê đơn ({history.length})
            </CardTitle>
            {history.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Thu gọn
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Xem tất cả
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Pill className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chưa có lịch sử kê đơn</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedHistory.map((item) => (
                <div
                  key={item.prescriptionId}
                  className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {format(
                            new Date(item.prescribedDate),
                            "dd/MM/yyyy",
                            { locale: vi }
                          )}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        BS: {item.doctorName || "N/A"}
                      </p>
                    </div>
                    {onCopyPrescription && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => onCopyPrescription(item)}
                        title="Sử dụng lại đơn này"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {item.diagnosis && (
                    <p className="text-sm mb-2">
                      <span className="font-medium">Chẩn đoán:</span>{" "}
                      {item.diagnosis}
                    </p>
                  )}

                  {/* Expandable drug list */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs w-full justify-between"
                      onClick={() =>
                        setExpandedId(
                          expandedId === item.prescriptionId
                            ? null
                            : item.prescriptionId
                        )
                      }
                    >
                      <span className="flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        {item.totalDrugs} loại thuốc
                      </span>
                      {expandedId === item.prescriptionId ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </Button>

                    {expandedId === item.prescriptionId && (
                      <div className="mt-2 space-y-1 pl-2 border-l-2 border-blue-200">
                        {item.items.map((drug, idx) => (
                          <div key={idx} className="text-xs">
                            <p className="font-medium">{drug.drugName}</p>
                            <p className="text-muted-foreground">
                              {drug.dosage} - {drug.instructions || drug.frequency}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
