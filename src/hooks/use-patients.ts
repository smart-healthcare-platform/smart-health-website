// "use client"

// import { MedicalRecord } from "@/types/examnation"
// import { Patient } from "@/types/patient/patient.type"
// import { useState, useEffect } from "react"



// export function usePatients() {
//   const [patients, setPatients] = useState<Patient[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         setLoading(true)
//         // Simulate API call
//         await new Promise((resolve) => setTimeout(resolve, 500))
//         setPatients(mockPatients)
//         setError(null)
//       } catch (err) {
//         setError("Không thể tải danh sách bệnh nhân")
//         console.error("Error fetching patients:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPatients()
//   }, [])

//   const createPatient = async (patient: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
//     const newPatient: Patient = {
//       ...patient,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//     setPatients((prev) => [...prev, newPatient])
//     return newPatient
//   }

//   const updatePatient = async (id: string, updates: Partial<Patient>) => {
//     setPatients((prev) =>
//       prev.map((patient) =>
//         patient.id === id ? { ...patient, ...updates, updatedAt: new Date().toISOString() } : patient,
//       ),
//     )
//   }

//   const deletePatient = async (id: string) => {
//     setPatients((prev) => prev.filter((patient) => patient.id !== id))
//   }

//   return {
//     patients,
//     loading,
//     error,
//     createPatient,
//     updatePatient,
//     deletePatient,
//   }
// }

// export function useMedicalRecords(patientId?: string) {
//   const [records, setRecords] = useState<MedicalRecord[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         setLoading(true)
//         await new Promise((resolve) => setTimeout(resolve, 300))

//         let filteredRecords = mockMedicalRecords
//         if (patientId) {
//           filteredRecords = mockMedicalRecords.filter((record) => record.patientId === patientId)
//         }

//         setRecords(filteredRecords)
//         setError(null)
//       } catch (err) {
//         setError("Không thể tải hồ sơ bệnh án")
//         console.error("Error fetching medical records:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchRecords()
//   }, [patientId])

//   const createRecord = async (record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">) => {
//     const newRecord: MedicalRecord = {
//       ...record,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//     setRecords((prev) => [...prev, newRecord])
//     return newRecord
//   }

//   return {
//     records,
//     loading,
//     error,
//     createRecord,
//   }
// }
