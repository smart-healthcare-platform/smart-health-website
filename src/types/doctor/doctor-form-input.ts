import { Gender } from "../patient/enums/patient-gender.enum.dto"
import { CreateDoctorCertificateDto } from "./dto/create-certificate.dto"
import { WeeklyAvailabilityDto } from "./dto/create-weekly.dto"

export type DoctorFormInput = {
    full_name: string
    email: string
    gender: Gender
    date_of_birth: string
    phone: string
    avatar?: string
    bio?: string
    active?: boolean
    experience_years: number
    certificates: CreateDoctorCertificateDto[]
    weeklyAvailability: WeeklyAvailabilityDto[]
}



