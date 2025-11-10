"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, User, Stethoscope } from "lucide-react"
import { TestStatusBadge } from "./test-status-badge"
import { LabResultsForm } from "./lab-results-form"
import { LabResultsView } from "./lab-test-result-view"
import { LabTestOrderResponse } from "@/types/examnation/response/lab-test.response"

interface LabTestsDetailProps {
    order: LabTestOrderResponse
    onUpdateOrder: (order: LabTestOrderResponse) => void
}

export function LabTestsDetail({ order, onUpdateOrder }: LabTestsDetailProps) {
    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()

    const getTestTypeLabel = (type: string) => {
        const labels = {
            "blood-test": "Xét nghiệm máu",
            "urine-test": "Xét nghiệm nước tiểu",
            imaging: "Chụp ảnh",
            ecg: "Điện tim",
            ultrasound: "Siêu âm",
            xray: "X-quang",
            other: "Khác",
        }
        return labels[type as keyof typeof labels] || type
    }

    const hasResult = !!order.result

    return (
        <div className="p-8 max-w-4xl">
            <Tabs defaultValue="info" className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                                        {getInitials(order.appointment.patientName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{order.appointment.patientName}</CardTitle>
                                    <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                                        <span>Mã BN: {order.appointment.patientId}</span>
                                    </div>
                                </div>
                            </div>
                            <TestStatusBadge status={order.status} />
                        </div>
                    </CardHeader>
                </Card>

                {/* Tabs */}
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info" className="gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Thông tin xét nghiệm
                    </TabsTrigger>
                    <TabsTrigger value="results" className="gap-2">
                        <FileText className="w-4 h-4" />
                        {hasResult ? "Xem kết quả" : "Nhập kết quả"}
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <User className="w-4 h-4" />
                        Lịch sử
                    </TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Chi tiết yêu cầu</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Loại xét nghiệm</p>
                                    <p className="font-medium">{getTestTypeLabel(order.type)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Trạng thái</p>
                                    <div className="flex gap-2 items-center">
                                        <TestStatusBadge status={order.status} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Được yêu cầu bởi</p>
                                    <p className="font-medium">{order.appointment.doctorName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Ngày yêu cầu</p>
                                    <p className="font-medium">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results">
                    {hasResult ? (
                        <LabResultsView result={order.result!} />
                    ) : (
                        <LabResultsForm order={order} onUpdateOrder={onUpdateOrder} />
                    )}

                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">
                                Lịch sử sẽ được cập nhật khi có kết quả
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
