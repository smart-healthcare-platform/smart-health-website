interface BaseUser {
    id: string;
    username: string;
    role: "PATIENT" | "DOCTOR" | "RECEPTIONIST" | "ADMIN";
    phone: string;
    email: string;
    createdAt: string;
    referenceId?: string;
}

interface PatientProfile {
    fullName: string;
    gender: string;
    address: string;
    dateOfBirth: string;
}

interface DoctorProfile {
    fullName: string;
    specialty: string;
    yearsOfExperience: number;
    dateOfBirth: string;
    avatar: string;
    gender: string
}

interface ReceptionistProfile {
    fullName: string;
    employeeId?: string;
    department?: string;
    shift?: "morning" | "afternoon" | "night" | "full-time";
    avatar?: string;
}

export type User =
    | (BaseUser & { role: "PATIENT"; profile: PatientProfile })
    | (BaseUser & { role: "DOCTOR"; profile: DoctorProfile })
    | (BaseUser & { role: "RECEPTIONIST"; profile: ReceptionistProfile })
    | (BaseUser & { role: "ADMIN" });
