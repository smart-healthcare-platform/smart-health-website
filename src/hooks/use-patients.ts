"use client"

import { useState, useEffect } from "react"
import type { Patient, MedicalRecord } from "@/types/patient"

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: "1",
    firstName: "Lan",
    lastName: "Nguyễn Thị",
    fullName: "Nguyễn Thị Lan",
    dateOfBirth: "1985-03-15",
    gender: "female",
    phone: "0901234567",
    email: "lan.nguyen@email.com",
    address: {
      street: "123 Đường Lê Lợi",
      ward: "Phường Bến Nghé",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
    },
    bloodType: "A+",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension"],
    emergencyContact: {
      name: "Nguyễn Văn Nam",
      relationship: "Chồng",
      phone: "0912345678",
    },
    insuranceNumber: "SV123456789",
    insuranceProvider: "BHXH TP.HCM",
    patientId: "BN001",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    isActive: true,
  },
  {
    id: "2",
    firstName: "Nam",
    lastName: "Trần Văn",
    fullName: "Trần Văn Nam",
    dateOfBirth: "1980-07-22",
    gender: "male",
    phone: "0912345678",
    email: "nam.tran@email.com",
    address: {
      street: "456 Đường Nguyễn Huệ",
      ward: "Phường Đa Kao",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
    },
    bloodType: "O+",
    allergies: [],
    chronicConditions: ["Diabetes Type 2"],
    emergencyContact: {
      name: "Trần Thị Mai",
      relationship: "Vợ",
      phone: "0923456789",
    },
    insuranceNumber: "SV987654321",
    insuranceProvider: "BHXH TP.HCM",
    patientId: "BN002",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-14T14:20:00Z",
    isActive: true,
  },
]

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: "1",
    patientId: "1",
    visitDate: "2024-01-15",
    visitType: "consultation",
    chiefComplaint: "Đau đầu và chóng mặt",
    symptoms: ["Headache", "Dizziness", "Fatigue"],
    vitalSigns: {
      temperature: 36.8,
      bloodPressure: { systolic: 140, diastolic: 90 },
      heartRate: 78,
      respiratoryRate: 16,
      weight: 65,
      height: 160,
    },
    diagnosis: {
      primary: "Hypertension",
      secondary: ["Stress-related headache"],
      icd10Code: "I10",
    },
    treatmentPlan: "Điều chỉnh thuốc hạ huyết áp, theo dõi huyết áp hàng ngày",
    medications: [
      {
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "1 lần/ngày",
        duration: "30 ngày",
        instructions: "Uống vào buổi sáng sau ăn",
      },
    ],
    followUpDate: "2024-02-15",
    followUpInstructions: "Tái khám sau 1 tháng, mang theo sổ theo dõi huyết áp",
    doctorId: "doc1",
    doctorName: "BS. Nguyễn Văn A",
    department: "Nội tim mạch",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:30:00Z",
  },
]

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setPatients(mockPatients)
        setError(null)
      } catch (err) {
        setError("Không thể tải danh sách bệnh nhân")
        console.error("Error fetching patients:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const createPatient = async (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPatients((prev) => [...prev, newPatient])
    return newPatient
  }

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, ...updates, updatedAt: new Date().toISOString() } : patient,
      ),
    )
  }

  const deletePatient = async (id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id))
  }

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
  }
}

export function useMedicalRecords(patientId?: string) {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 300))

        let filteredRecords = mockMedicalRecords
        if (patientId) {
          filteredRecords = mockMedicalRecords.filter((record) => record.patientId === patientId)
        }

        setRecords(filteredRecords)
        setError(null)
      } catch (err) {
        setError("Không thể tải hồ sơ bệnh án")
        console.error("Error fetching medical records:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [patientId])

  const createRecord = async (record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRecords((prev) => [...prev, newRecord])
    return newRecord
  }

  return {
    records,
    loading,
    error,
    createRecord,
  }
}
