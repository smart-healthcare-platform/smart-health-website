import { CertificateType } from "../enums/doctor-certificate.type";
import { AcademicDegree } from "../enums/academic-degree.enum";

export type CreateDoctorCertificateDto = {
    doctor_id: string;
    type: CertificateType;

    // DEGREE ONLY
    academic_degree?: AcademicDegree;
    field?: string;
    graduation_year?: number;

    // LICENSE ONLY
    license_number?: string;
    issued_date?: string;
    expiry_date?: string;
    issued_by?: string;

    // COMMON
    description?: string;
    certificate_file?: string;

    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    is_verified?: boolean;
    verified_at?: string;     
    verified_by?: string;
};
