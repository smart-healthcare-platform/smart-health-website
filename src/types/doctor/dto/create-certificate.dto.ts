import { CertificateType } from "../enums/doctor-certificate.type";

export type CreateDoctorCertificateDto = {
    doctor_id: string;
    type: CertificateType;
    title: string;

    field?: string;
    certificate_number?: string;
    graduation_year?: number;
    issued_date?: string;  
    expiry_date?: string;
    issued_by?: string;
    description?: string;
    certificate_file?: string;

    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    is_verified?: boolean;
    verified_at?: Date;
    verified_by?: string;
};