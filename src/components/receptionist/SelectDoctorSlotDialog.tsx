"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { doctorService } from "@/services/doctor.service";
import { receptionistService } from "@/services/receptionist.service";
import { toast } from "react-toastify";
import { Doctor } from "@/types/doctor/doctor.type";
import { TimeSlot } from "@/types/timeSlot";
import { Calendar, Clock, Search, Stethoscope, CheckCircle2 } from "lucide-react";

interface SelectDoctorSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName: string;
  onSuccess: () => void;
}

export function SelectDoctorSlotDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  onSuccess,
}: SelectDoctorSlotDialogProps) {
  const [step, setStep] = useState<"doctor" | "slot" | "confirm">("doctor");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState("");

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors(1, 50, searchTerm);
      setDoctors(response.data || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchSlots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctor]);

  const fetchSlots = async () => {
    if (!selectedDoctor) return;
    
    try {
      setLoading(true);
      const slotsData = await doctorService.getDoctorSlots(selectedDoctor.id);
      // Lọc chỉ lấy slots available
      const availableSlots = slotsData.filter((slot) => slot.status === "available");
      setSlots(availableSlots);
    } catch (error) {
      console.error("Failed to fetch slots:", error);
      toast.error("Không thể tải lịch khám");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep("slot");
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !selectedSlot) {
      toast.error("Vui lòng chọn bác sĩ và giờ khám");
      return;
    }

    try {
      setLoading(true);
      await receptionistService.createWalkInAppointment({
        patientId,
        patientName,
        doctorId: selectedDoctor.id,
        doctorName: `BS. ${selectedDoctor.full_name}`,
        slotId: selectedSlot.id,
        notes,
        receptionistNotes: "Walk-in appointment created by receptionist",
      });

      toast.success("Đặt lịch khám thành công!");
      onSuccess();
      handleClose();
    } catch (error: unknown) {
      console.error("Failed to create appointment:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as {response?: {data?: {message?: string}}}).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Không thể đặt lịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("doctor");
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setSlots([]);
    setNotes("");
    setSearchTerm("");
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === "slot") {
      setStep("doctor");
      setSelectedSlot(null);
    } else if (step === "confirm") {
      setStep("slot");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "doctor" && <Stethoscope className="h-5 w-5" />}
            {step === "slot" && <Calendar className="h-5 w-5" />}
            {step === "confirm" && <CheckCircle2 className="h-5 w-5" />}
            {step === "doctor" && "Chọn bác sĩ"}
            {step === "slot" && `Chọn giờ khám - ${selectedDoctor?.full_name}`}
            {step === "confirm" && "Xác nhận đặt lịch"}
          </DialogTitle>
          <DialogDescription>
            Bệnh nhân: <strong>{patientName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === "doctor" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bác sĩ theo tên hoặc chuyên khoa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchDoctors()}
                />
                <Button onClick={fetchDoctors} disabled={loading}>
                  Tìm
                </Button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all"
                      onClick={() => handleSelectDoctor(doctor)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">BS. {doctor.full_name}</h4>
                          <p className="text-sm text-gray-600">{(doctor as {specialty?: string}).specialty || 'Chưa cập nhật'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{doctor.experience_years || 0} năm kinh nghiệm</Badge>
                            {((doctor as {average_rating?: number}).average_rating || 0) > 0 && (
                              <Badge variant="secondary">⭐ {((doctor as {average_rating?: number}).average_rating || 0).toFixed(1)}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {doctors.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-8">Không tìm thấy bác sĩ</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {step === "slot" && (
            <div className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedSlot?.id === slot.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => handleSelectSlot(slot)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{slot.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span>{slot.time}</span>
                      </div>
                    </div>
                  ))}
                  {slots.length === 0 && !loading && (
                    <div className="col-span-3 text-center text-gray-500 py-8">
                      Không có lịch khám khả dụng
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-gray-600">Bệnh nhân:</div>
                  <div className="font-semibold">{patientName}</div>

                  <div className="font-medium text-gray-600">Bác sĩ:</div>
                  <div className="font-semibold">BS. {selectedDoctor?.full_name}</div>

                  <div className="font-medium text-gray-600">Ngày khám:</div>
                  <div>{selectedSlot?.date}</div>

                  <div className="font-medium text-gray-600">Giờ khám:</div>
                  <div>{selectedSlot?.time}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ghi chú về lý do khám hoặc triệu chứng..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between border-t pt-4">
          <div>
            {step !== "doctor" && (
              <Button variant="outline" onClick={handleBack}>
                Quay lại
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            {step === "confirm" && (
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
