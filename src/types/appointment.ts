export interface Appointment {
    date: Date | null;
    time: string;
    type: 'in-person' | 'online' | 'phone';
  }
  