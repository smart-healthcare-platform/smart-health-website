"use client"
import { useEffect, useState } from "react";
import { Patient } from "@/types/patient/patient.type";
import { patientService } from "@/services/patient.service";
import StatsCards from "./stats-cards";
import PatientFilters from "./patient-filters";
import PatientTable from "./patient-table";
import Pagination from "@/components/ui/pagination-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { PaginatedResponse } from "@/types/response";

export function PatientManagement() {
  const [patientsResponse, setPatientsResponse] = useState<PaginatedResponse<Patient>>({
    data: [],
    total: 0,
    page: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [stats, setStats] = useState({
    totalPatients: { value: 0, change: 0 },
    newThisMonth: { value: 0, change: 0 },
    averageAge: { value: 0, change: 0 },
  });

  // Lấy danh sách bệnh nhân
  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      try {
        const response = await patientService.getAllPatients(page, limit, searchTerm);
        setPatientsResponse(response);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [page, searchTerm]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await patientService.getStats();
        setStats(response);
      } catch (error) {
        console.error("Không thể lấy số liệu thống kê", error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý bệnh nhân</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tất cả hồ sơ bệnh nhân</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất dữ liệu
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm bệnh nhân
          </Button>
        </div>
      </div>

      <StatsCards
        totalPatients={stats.totalPatients}
        newThisMonth={stats.newThisMonth}
        averageAge={stats.averageAge}
      />

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân</CardTitle>
          <CardDescription>Danh sách đầy đủ tất cả bệnh nhân</CardDescription>
        </CardHeader>

        <CardContent>
          <PatientFilters
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setPage(1); // reset page khi tìm kiếm
            }}
          />

          {loading ? (
            <p className="text-center py-10 text-muted-foreground">Đang tải dữ liệu...</p>
          ) : (
            <>
              <PatientTable patients={patientsResponse.data} />

              <Pagination
                page={page}
                limit={limit}
                total={patientsResponse.total}
                setPage={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
