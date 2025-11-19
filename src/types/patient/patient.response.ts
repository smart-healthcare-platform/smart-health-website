import { Patient } from "./patient.type"

export interface PatientListResponse {
    data: Patient[]
    total: number
    page: number
    limit: number
  }