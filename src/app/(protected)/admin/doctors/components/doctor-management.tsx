"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"
import { DoctorStatsCards } from "./stats-cards"
import { DoctorFilters } from "./doctor-filters"
import { DoctorTable } from "./doctor-table"

import { doctorService } from "@/services/doctor.service"
import AddDoctorDialog from "./doctor-create-dialog"
import PaginationTable from "@/components/ui/pagination-table"

export function DoctorManagement() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [stats, setStats] = useState({
    totalDoctors: { value: 0, change: 0 },
    newThisMonth: { value: 0, change: 0 },
    averageAge: { value: 0, change: 0 },
  });

  const fetchStats = async () => {
    const res = await doctorService.getStats();
    setStats(res);
  };

  const fetchDoctors = async () => {
    setLoading(true)
    const res = await doctorService.getAllDoctors(page, limit, searchTerm)
    setDoctors(res.data)
    setTotalDoctors(res.total)
    setLoading(false)
  }

  useEffect(() => {
    fetchDoctors();
  }, [page, searchTerm]);


  useEffect(() => {
    fetchStats();
  }, []);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý bác sĩ</h1>
          <p className="text-muted-foreground">Quản lý nhân sự y tế và lịch làm việc</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button size="sm" onClick={() => setOpenAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm bác sĩ
          </Button>
        </div>
      </div>

      <DoctorStatsCards
        totalDoctors={stats.totalDoctors}
        newThisMonth={stats.newThisMonth}
        averageAge={stats.averageAge}
      />

      <DoctorFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <DoctorTable doctors={doctors} />
      )}

      <PaginationTable
        page={page}
        limit={limit}
        total={totalDoctors}
        setPage={setPage}
      />

      <AddDoctorDialog
        isOpen={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={() => {
          fetchDoctors(); // reload danh sách sau khi thêm bác sĩ
        }}
      />
    </div>
  )
}
