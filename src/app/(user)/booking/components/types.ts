export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
  }
  
  export interface Appointment {
    date: Date | null;
    time: string;
    type: 'in-person' | 'online' | 'phone';
  }
  
  export interface Patient {
    fullName: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    note: string;
    paymentMethod: 'on-site' | 'online' | 'insurance';
  }