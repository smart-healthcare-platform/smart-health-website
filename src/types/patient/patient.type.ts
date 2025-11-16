export interface Patient {
    id: string;
    user_id: string;
    full_name: string;
    date_of_birth: string;
    gender: string | null;
    address: string;
    phone:string
    created_at: string;
    updated_at: string;
}
