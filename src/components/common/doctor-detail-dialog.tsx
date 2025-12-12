"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    User,
    Phone,
    Mail,
    UserX,
    ShieldAlert,
    RefreshCw,
    GraduationCap,
    FileCheck2
} from "lucide-react"

import ConfirmDialog from "../ui/confirm-dialog"
import SuccessDialog from "../ui/success-dialog"
import ErrorDialog from "../ui/error-dialog"
import { authService } from "@/services/auth.service"
import { DoctorDetail } from "@/types/doctor/doctor.type"
import { UserAccount } from "@/types/auth/auth-type"
import { formatDate } from "@/lib/format"
import { CertificateType } from "@/types/doctor/enums/doctor-certificate.type"

interface DoctorDetailDialogProps {
    doctor: DoctorDetail | null
    account: UserAccount | null
    isOpen: boolean
    onClose: () => void
    onDisabled?: () => void
}

export default function DoctorDetailDialog({
    doctor,
    account,
    isOpen,
    onClose,
    onDisabled,
}: DoctorDetailDialogProps) {

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loadingAction, setLoadingAction] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [actionType, setActionType] = useState<"disable" | "activate">("disable")

    if (!doctor || !account) return null

    const handleAction = async () => {
        try {
            setLoadingAction(true)
            setConfirmOpen(false)

            if (actionType === "disable") {
                await authService.deActiveUser(doctor.id)
            } else {
                await authService.activeUser(doctor.id)
            }

            setSuccessOpen(true)
            onDisabled?.()
            onClose()
        } catch (err: any) {
            setErrorMessage(err.message || "Có lỗi xảy ra")
            setErrorOpen(true)
        } finally {
            setLoadingAction(false)
        }
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-3xl w-[700px] min-h-[550px] p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Thông tin bác sĩ
                            </DialogTitle>
                        </DialogHeader>

                        <Separator className="my-4" />

                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid grid-cols-3 mb-3">
                                <TabsTrigger value="profile">Thông tin</TabsTrigger>
                                <TabsTrigger value="certificates">Bằng cấp</TabsTrigger>
                                <TabsTrigger value="status">Tài khoản</TabsTrigger>
                            </TabsList>

                            <div className="h-[420px] overflow-y-auto pr-2">

                                {/* TAB: PROFILE */}
                                <TabsContent value="profile">
                                    <div className="bg-muted/40 p-4 rounded-lg space-y-6">

                                        {/* Cá nhân */}
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-lg">Thông tin cá nhân</h3>

                                            <p><span className="text-sm text-muted-foreground">Họ và tên:</span><br />
                                                <span className="font-medium">{doctor.full_name}</span>
                                            </p>

                                            <p><span className="text-sm text-muted-foreground">Giới tính:</span><br />
                                                <span className="font-medium">{doctor.gender === "FEMALE" ? "Nữ" : doctor.gender === "MALE" ? "Nam" : "Khác"}</span>
                                            </p>

                                            <p><span className="text-sm text-muted-foreground">Ngày sinh:</span><br />
                                                <span className="font-medium">{formatDate(doctor.date_of_birth)}</span>
                                            </p>

                                            {/* <p><span className="text-sm text-muted-foreground">ID Bác sĩ:</span><br />
                                                <span className="font-mono">{doctor.id}</span>
                                            </p> */}
                                        </div>

                                        <Separator />

                                        {/* Liên hệ */}
                                        <div>
                                            <h3 className="font-semibold flex items-center gap-2">
                                                <FileCheck2 className="w-4 h-4 text-primary" />
                                                Thông tin liên hệ
                                            </h3>

                                            <div className="mt-3 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-primary" />
                                                    <span>{doctor.phone || "Không có"}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-primary" />
                                                    <span>{account.email || "Không có"}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </TabsContent>

                                {/* TAB: CERTIFICATES */}
                                <TabsContent value="certificates">
                                    <div className="bg-muted/40 p-4 rounded-lg space-y-6">

                                        <div>
                                            <h3 className="font-semibold flex items-center gap-2 mb-2">
                                                <GraduationCap className="w-4 h-4 text-primary" />
                                                Bằng cấp & Chứng chỉ
                                            </h3>

                                            {doctor.certificates.map((ct) => (
                                                <div key={ct.id} className="p-3 bg-white rounded-lg shadow-sm border">

                                                    <p className="font-medium">{ct.academic_degree}</p>

                                                    <p className="text-sm text-muted-foreground">
                                                        Loại: {ct.type === CertificateType.DEGREE ? "Bằng cấp" : "Chứng chỉ hành nghề"}
                                                    </p>

                                                    {/* HIỂN THỊ CHO BẰNG CẤP */}
                                                    {ct.type === CertificateType.DEGREE && (
                                                        <>
                                                            {ct.field && (
                                                                <p className="text-sm">Chuyên ngành: {ct.field}</p>
                                                            )}
                                                            {ct.graduation_year && (
                                                                <p className="text-sm">Năm tốt nghiệp: {ct.graduation_year}</p>
                                                            )}
                                                            {ct.certificate_file && (
                                                                <p className="text-sm">
                                                                    File: <a
                                                                        href={ct.certificate_file}
                                                                        target="_blank"
                                                                        className="text-primary underline"
                                                                    >
                                                                        Xem file
                                                                    </a>
                                                                </p>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* HIỂN THỊ CHO CHỨNG CHỈ HÀNH NGHỀ */}
                                                    {ct.type === CertificateType.LICENSE && (
                                                        <>
                                                            {ct.license_number && (
                                                                <p className="text-sm">Số chứng chỉ: {ct.license_number}</p>
                                                            )}
                                                            {ct.issued_by && (
                                                                <p className="text-sm">Cơ quan cấp: {ct.issued_by}</p>
                                                            )}
                                                            {ct.issued_date && (
                                                                <p className="text-sm">
                                                                    Ngày cấp: {new Date(ct.issued_date).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                            {ct.expiry_date && (
                                                                <p className="text-sm">
                                                                    Ngày hết hạn: {new Date(ct.expiry_date).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                            {ct.certificate_file && (
                                                                <p className="text-sm">
                                                                    File: <a
                                                                        href={ct.certificate_file}
                                                                        target="_blank"
                                                                        className="text-primary underline"
                                                                    >
                                                                        Xem file
                                                                    </a>
                                                                </p>
                                                            )}
                                                        </>
                                                    )}

                                                </div>
                                            ))}

                                        </div>

                                        <Separator />


                                    </div>
                                </TabsContent>

                                {/* TAB: STATUS */}
                                <TabsContent value="status">
                                    <div className="bg-muted/40 p-4 rounded-lg space-y-5">

                                        <div>
                                            <h3 className="font-semibold text-lg">Trạng thái tài khoản</h3>
                                            <Badge
                                                variant={account.isActive ? "default" : "destructive"}
                                                className={`px-3 py-1 mt-1 ${account.isActive ? "bg-emerald-100 text-emerald-800" : ""}`}
                                            >
                                                {account.isActive ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                                            </Badge>
                                        </div>

                                        <Button
                                            variant={account.isActive ? "destructive" : "default"}
                                            onClick={() => {
                                                setActionType(account.isActive ? "disable" : "activate")
                                                setConfirmOpen(true)
                                            }}
                                            className="gap-2 w-full text-base"
                                        >
                                            {account.isActive ? <UserX className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                                            {account.isActive ? "Vô hiệu hóa tài khoản" : "Kích hoạt lại tài khoản"}
                                        </Button>

                                    </div>
                                </TabsContent>

                            </div>
                        </Tabs>

                        <Separator className="my-4" />

                        <div className="flex justify-end">
                            <Button variant="outline" onClick={onClose}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* DIALOGS */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleAction}
                title={actionType === "disable" ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt"}
                description={`Bạn có chắc muốn ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt lại"} tài khoản của bác sĩ ${doctor.full_name}?`}
                confirmText="Xác nhận"
                cancelText="Hủy"
                tone={actionType === "disable" ? "danger" : "success"}
                icon={<ShieldAlert className="w-10 h-10 text-white" />}
            />

            <SuccessDialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={`Tài khoản của bác sĩ ${doctor.full_name} đã được ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt lại"} thành công!`}
                title={actionType === "disable" ? "Vô hiệu hóa thành công" : "Kích hoạt thành công"}
            />

            <ErrorDialog
                open={errorOpen}
                onClose={() => setErrorOpen(false)}
                message={errorMessage}
                title={`Lỗi khi ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt"} tài khoản`}
            />
        </>
    )
}
