// types.ts
export interface PatientFormData {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;  // dùng string để bind với input type="date"
  gender: string;
  address: string;
  symptoms: string;
}
