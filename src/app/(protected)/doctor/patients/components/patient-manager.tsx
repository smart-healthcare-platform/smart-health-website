"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, User, Calendar, FileText, Phone } from "lucide-react"
import { PatientOverview } from "./patient-overview"
import { MedicalHistory } from "./medical-history"
import { usePatients, useMedicalRecords } from "@/hooks/use-patients"
import type { Patient } from "@/types/patient"

export function PatientManager() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const { patients, loading: patientsLoading } = usePatients()
  const { records, loading: recordsLoading } = useMedicalRecords(selectedPatient?.id)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleCreatePatient = () => {
    // TODO: Open create patient modal
    console.log("Create new patient")
  }

  const handleEditPatient = () => {
    // TODO: Open edit patient modal
    console.log("Edit patient:", selectedPatient)
  }

  const handleCreateRecord = () => {
    // TODO: Open create medical record modal
    console.log("Create medical record for:", selectedPatient)
  }

  const handleViewRecord = (record: any) => {
    // TODO: Open record detail modal
    console.log("View record:", record)
  }

  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Đang tải danh sách bệnh nhân...</div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6">
      {/* Patient List Sidebar */}
      <div className="w-80 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Danh sách bệnh nhân</CardTitle>
              <Button onClick={handleCreatePatient} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  {searchTerm ? "Không tìm thấy bệnh nhân" : "Chưa có bệnh nhân nào"}
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50
                        ${selectedPatient?.id === patient.id ? "bg-primary/10 border border-primary/20" : ""}
                      `}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-sm bg-secondary">
                            {getInitials(patient.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{patient.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {calculateAge(patient.dateOfBirth)} tuổi • {patient.patientId}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{patient.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Details */}
      <div className="flex-1">
        {selectedPatient ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="overview" className="gap-2">
                  <User className="w-4 h-4" />
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Lịch sử khám
                </TabsTrigger>
                <TabsTrigger value="appointments" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Lịch hẹn
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <PatientOverview patient={selectedPatient} onEdit={handleEditPatient} />
            </TabsContent>

            <TabsContent value="history">
              <MedicalHistory
                records={records}
                loading={recordsLoading}
                onViewRecord={handleViewRecord}
                onCreateRecord={handleCreateRecord}
              />
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">Tính năng lịch hẹn đang được phát triển</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Chọn bệnh nhân</h3>
                <p className="text-muted-foreground">Chọn một bệnh nhân từ danh sách để xem thông tin chi tiết</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
