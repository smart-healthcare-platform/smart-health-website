import { Gender } from "./enums/patient-gender.enum.dto";

export interface Patient {
    id: string;
    user_id: string;
    full_name: string;
    date_of_birth: string;
    gender: string | null;
    address: string;
    phone: string
    created_at: string;
    updated_at: string;
}



export interface CreatePatientDto {
    full_name: string;
    user_id: string;
    date_of_birth?: string;
    gender?: Gender;
    address?: string;
    phone?: string;
}

export type UpdatePatientDto = Partial<CreatePatientDto>;

