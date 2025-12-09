import { Gender } from "@/types/patient/enums/patient-gender.enum.dto";

export interface CreateDoctorDto {
    full_name: string;
    gender: Gender;
    date_of_birth: string;
    avatar?: string;
    phone: string;
    experience_years: number;
    bio?: string;
    email: string;
}
