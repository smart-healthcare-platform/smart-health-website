"use client"

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Patient } from "@/types/patient/patient.type";
import PatientDetailDialog from "@/components/common/patient-detail-dialog";
import { authService } from "@/services/auth.service";
import { UserAccount } from "@/types/auth/auth-type";
import { calculateAge, formatVNDate } from "@/lib/format";

interface PatientTableProps {
    patients: Patient[];
}

export default function PatientTable({ patients }: PatientTableProps) {
    const [patientAccount, setPatientAccount] = useState<UserAccount | null>(null);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleViewDetails = async (userId: string, patient: Patient) => {
        setLoading(true);
        try {
            const res = await authService.getUserById(userId);
            setPatientAccount(res);
            setSelectedPatient(patient);
            setOpenDialog(true);
        } catch (error) {
            console.error("Không thể lấy thông tin chi tiết", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên BN</TableHead>
                            <TableHead>Liên hệ</TableHead>
                            <TableHead>Giới tính</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.full_name}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.gender === "FEMALE" ? "Nữ" : patient.gender === "MALE" ? "Nam" : "Khác"}</TableCell>
                                <TableCell>
                                    {formatVNDate(patient.date_of_birth)}
                                    <div className="text-xs text-muted-foreground">
                                        ({calculateAge(patient.date_of_birth)} tuổi)
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleViewDetails(patient.user_id, patient)}
                                        title="Xem chi tiết"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {loading && <p className="text-center text-sm text-muted-foreground py-2">Đang tải chi tiết...</p>}

            <PatientDetailDialog
                patient={selectedPatient}
                account={patientAccount}
                isOpen={openDialog}
                onClose={() => setOpenDialog(false)}
            />

        </>
    );
}
