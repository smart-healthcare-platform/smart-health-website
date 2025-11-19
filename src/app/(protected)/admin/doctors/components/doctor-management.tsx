"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"
import { DoctorStatsCards } from "./stats-cards"
import { DoctorFilters } from "./doctor-filters"
import { DoctorTable } from "./doctor-table"
import Pagination from "../../common/pagination"
import { doctorService } from "@/services/doctor.service"

export function DoctorManagement() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  const fetchDoctors = async () => {
    setLoading(true)
    const res = await doctorService.getAllDoctors(page, limit, searchTerm)
    console.log(res)
    setDoctors(res.data)
    setTotalDoctors(res.total)
    setLoading(false)
  }

  useEffect(() => {
    fetchDoctors()
  }, [page, searchTerm])

  // Dữ liệu thống kê giả lập, bạn có thể lấy từ API nếu có
  const stats = {
    totalDoctors: { value: totalDoctors, change: 2.1 },
    activeToday: { value: 89, change: 5.3 },
    newThisMonth: { value: 8, change: 12.5 },
    onLeave: { value: 12, change: -1.2 },
  }

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
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm bác sĩ
          </Button>
        </div>
      </div>


      <DoctorStatsCards
        totalDoctors={stats.totalDoctors}
        activeToday={stats.activeToday}
        newThisMonth={stats.newThisMonth}
        onLeave={stats.onLeave}
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

      {/* Pagination */}
      <Pagination
        page={page}
        limit={limit}
        total={totalDoctors}
        setPage={setPage}
      />
    </div>
  )
}
