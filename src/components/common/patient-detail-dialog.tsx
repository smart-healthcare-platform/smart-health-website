import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Phone, LucideMapPin, UserX, ShieldAlert, Loader2, Send, RefreshCw } from "lucide-react"
import { Patient } from "@/types/patient/patient.type"
import { UserAccount } from "@/types/auth/auth-type"
import ConfirmDialog from "../ui/confirm-dialog"
import SuccessDialog from "../ui/success-dialog"
import ErrorDialog from "../ui/error-dialog"
import { authService } from "@/services/auth.service"

interface PatientDetailDialogProps {
    patient: Patient | null
    account: UserAccount | null
    isOpen: boolean
    onClose: () => void
    onDisabled?: () => void
}

export default function PatientDetailDialog({
    patient,
    account,
    isOpen,
    onClose,
    onDisabled,
}: PatientDetailDialogProps) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [loadingAction, setLoadingAction] = useState(false)
    const [successOpen, setSuccessOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [actionType, setActionType] = useState<"disable" | "activate">("disable")

    if (!patient || !account) return null

    const handleAction = async () => {
        try {
            setLoadingAction(true)
            setConfirmOpen(false)

            if (actionType === "disable") {
                await authService.deActiveUser(patient.user_id)
                setSuccessOpen(true)
            } else {
                await authService.activeUser(patient.user_id)
                setSuccessOpen(true)
            }

            onDisabled?.()
            onClose()
        } catch (err: any) {
            console.error('Account action failed:', err)
            setErrorMessage(err.message || `Không thể ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt"} tài khoản`)
            setErrorOpen(true)
        } finally {
            setLoadingAction(false)
        }
    }

    return (
        <>
            {/* MAIN DIALOG */}
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-xl w-[600px] min-h-[520px] p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Thông tin bệnh nhân
                            </DialogTitle>
                        </DialogHeader>

                        <Separator className="my-4" />

                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid grid-cols-3 mb-4">
                                <TabsTrigger value="info">Cá nhân</TabsTrigger>
                                <TabsTrigger value="contact">Liên hệ</TabsTrigger>
                                <TabsTrigger value="status">Tài khoản</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info">
                                <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Họ và tên</p>
                                        <p className="font-medium">{patient.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">ID bệnh nhân</p>
                                        <p className="font-mono">{patient.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Giới tính</p>
                                        <p className="font-medium">{patient.gender === "FEMALE" ? "Nữ" : patient.gender === "MALE" ? "Nam" : "Khác"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Ngày sinh</p>
                                        <p className="font-medium">{patient.date_of_birth}</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="contact">
                                <div className="bg-muted/40 p-4 rounded-lg space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span>{patient.phone || "Không có"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Send className="w-4 h-4 text-primary" />
                                        <span>{account.email || "Không có"}</span>
                                    </div>
                                    {patient.address && (
                                        <div className="flex items-center gap-2">
                                            <LucideMapPin className="w-4 h-4 text-primary" />
                                            <span>{patient.address}</span>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

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

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleAction}
                title={actionType === "disable" ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt"}
                description={`Bạn có chắc muốn ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt lại"} tài khoản của ${patient.full_name}?`}
                confirmText="Xác nhận"
                cancelText="Hủy"
                tone={actionType === "disable" ? "danger" : "success"}
                icon={<ShieldAlert className="w-10 h-10 text-white" />}
            />

            {/* Success Dialog */}
            <SuccessDialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={`Tài khoản của ${patient.full_name} đã được ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt lại"} thành công!`}
                title={actionType === "disable" ? "Vô hiệu hóa thành công" : "Kích hoạt thành công"}
            />

            {/* Error Dialog */}
            <ErrorDialog
                open={errorOpen}
                onClose={() => setErrorOpen(false)}
                message={errorMessage}
                title={`Lỗi khi ${actionType === "disable" ? "vô hiệu hóa" : "kích hoạt"} tài khoản`}
            />
        </>
    )
}
