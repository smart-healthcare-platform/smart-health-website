
import { Gender } from "../patient/enums/patient-gender.enum.dto";
import { DayOfWeek } from "./dto/create-weekly.dto";
import { AcademicDegree } from "./enums/academic-degree.enum";
import { CertificateType } from "./enums/doctor-certificate.type";

export interface Doctor {
    id: string;
    full_name: string;
    display_name: string;
    avatar: string;
    experience_years: number;
    bio: string;
    active: boolean;
    degree: string;
    phone: string
    gender: Gender,
    date_of_birth: string,
    user_id: string
}

export interface DoctorDetail {
    id: string
    full_name: string
    email: string
    phone: string
    gender: string
    date_of_birth: string
    avatar: string
    experience_years: number
    bio: string
    active: boolean
    created_at: string
    updated_at: string
    display_name: string
    certificates: DoctorCertificate[];

    ratings: Array<{
        id: string
        doctor_id: string
        rating: number
        comment: string
        patient_id: string
        created_at: string
    }>

    weeklyAvailabilities: Array<{
        id: string
        doctor_id: string
        day_of_week: string
        start_time: string
        end_time: string
        created_at: string
    }>

    blocks: Array<{
        id: string
        doctor_id: string
        start_time: string
        end_time: string
        reason: string
        created_at: string
    }>

    slots: Array<{
        id: string
        doctor_id: string
        start_time: string
        end_time: string
        status: 'available' | 'booked' | 'cancelled'
        patient_id: string | null
        created_at: string
        updated_at: string
    }>
}

export interface DoctorCertificate {
    id: string;
    doctor: Doctor | null;

    type: CertificateType;

    academic_degree: AcademicDegree | null;

    field: string | null;
    license_number: number | null;
    graduation_year: number | null;

    issued_date: string | null;
    expiry_date: string | null;

    issued_by: string | null;
    description: string | null;

    certificate_file: string | null;

    status: "PENDING" | "APPROVED" | "REJECTED";

    is_verified: boolean;

    verified_at: string | null;
    verified_by: string | null;

    created_at: string;
    updated_at: string;
}


export interface WeeklyAvailability {
    id: string;
    day_of_week: DayOfWeek;
    start_time: string;
    end_time: string;
}