"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { receptionistService, RegisterWalkInPatientRequest, RegisterWalkInPatientResponse } from "@/services/receptionist.service";
import { toast } from "react-toastify";
import { UserPlus, Copy, CheckCircle2, AlertCircle } from "lucide-react";

interface CreateWalkInPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (userId: string, patientName: string) => void;
}

export function CreateWalkInPatientDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateWalkInPatientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [temporaryPassword, setTemporaryPassword] = useState<string>("");
  const [createdUser, setCreatedUser] = useState<RegisterWalkInPatientResponse['user'] | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState<RegisterWalkInPatientRequest>({
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "MALE",
    address: "",
    notes: "",
  });

  const handleInputChange = (field: keyof RegisterWalkInPatientRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.fullName || !formData.phone || !formData.email || !formData.dateOfBirth) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate phone format
    const phoneRegex = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const response = await receptionistService.registerWalkInPatient(formData);
      
      setCreatedUser(response.user);
      setTemporaryPassword(response.temporaryPassword);
      setStep("success");
      
      toast.success("Tạo tài khoản thành công!");
    } catch (error: unknown) {
      console.error("Failed to register walk-in patient:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as {response?: {data?: {message?: string}}}).response?.data?.message 
        : undefined;
      toast.error(errorMessage || "Không thể tạo tài khoản. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    toast.success("Đã sao chép mật khẩu!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinueToBooking = () => {
    if (createdUser) {
      onSuccess(createdUser.id, createdUser.fullName);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "MALE",
      address: "",
      notes: "",
    });
    setTemporaryPassword("");
    setCreatedUser(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {step === "form" ? "Đăng ký bệnh nhân mới (Walk-in)" : "Tài khoản đã tạo thành công"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" 
              ? "Nhập thông tin bệnh nhân đến khám trực tiếp tại bệnh viện"
              : "Vui lòng cung cấp thông tin đăng nhập cho bệnh nhân"
            }
          </DialogDescription>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Ngày sinh <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="0901234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Giới tính <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "MALE" | "FEMALE") => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Nam</SelectItem>
                    <SelectItem value="FEMALE">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  placeholder="123 ABC Street, HCM"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                placeholder="Ghi chú về bệnh nhân (nếu có)"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Hệ thống sẽ tự động tạo tài khoản và mật khẩu tạm thời cho bệnh nhân.
                Vui lòng cung cấp thông tin đăng nhập cho bệnh nhân sau khi tạo.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Tài khoản đã được tạo thành công! Vui lòng cung cấp thông tin đăng nhập cho bệnh nhân.
              </AlertDescription>
            </Alert>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium text-gray-600">Họ tên:</div>
                <div className="font-semibold">{createdUser?.fullName}</div>

                <div className="font-medium text-gray-600">Username:</div>
                <div className="font-mono text-blue-600">{createdUser?.username}</div>

                <div className="font-medium text-gray-600">Email:</div>
                <div>{createdUser?.email}</div>
              </div>

              <div className="border-t pt-3 mt-3">
                <Label className="text-sm font-medium text-gray-600">
                  Mật khẩu tạm thời:
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={temporaryPassword}
                    readOnly
                    className="font-mono text-lg font-bold bg-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPassword}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Lưu ý quan trọng:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Vui lòng cung cấp username và mật khẩu tạm thời cho bệnh nhân</li>
                  <li>Khuyến khích bệnh nhân đổi mật khẩu sau khi đăng nhập lần đầu</li>
                  <li>Mật khẩu tạm thời chỉ hiển thị một lần</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            {step === "form" ? "Hủy" : "Đóng"}
          </Button>
          {step === "form" ? (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          ) : (
            <Button onClick={handleContinueToBooking}>
              Tiếp tục đặt lịch khám
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
