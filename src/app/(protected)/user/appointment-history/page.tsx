"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import AppointmentFilters from "./components/appointment-filters";
import AppointmentList from "./components/appointment-list";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Filter as FilterIcon,
} from "lucide-react";
import type { Appointment, AppointmentResponse } from "@/types/appointment";
import { appointmentService } from "@/services/appointment.service";
import { RootState } from "@/redux/index";
import useDebounce from "@/hooks/use-debounce";
import Loading from "@/components/ui/loading";

export default function AppointmentHistoryPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [apiData, setApiData] = useState<AppointmentResponse | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const limit = 3;
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedSearchRef = useRef(filters.search);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    if (!user?.referenceId) return;
    setLoadingList(true);
    try {
      const data = await appointmentService.getByPatientId(
        user.referenceId,
        currentPage,
        limit,
        debouncedSearch,
        filters.status as any,
        filters.dateRange as any
      );
      setApiData(data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setApiData(null);
    } finally {
      setLoadingList(false);
      setIsSearching(false);
    }
  }, [
    user?.referenceId,
    currentPage,
    debouncedSearch,
    filters.status,
    filters.dateRange,
  ]);

  useEffect(() => {
    // Only fetch if search changed
    if (debouncedSearchRef.current !== debouncedSearch) {
      debouncedSearchRef.current = debouncedSearch;
      setCurrentPage(1); // Reset page when search changes
    }
    fetchAppointments();
  }, [fetchAppointments, debouncedSearch]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsSearching(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setIsSearching(true);
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setIsSearching(true);
  }, []);

  const totalPages = useMemo(
    () => (apiData ? Math.ceil(apiData.total / limit) : 0),
    [apiData, limit]
  );

  const stats = useMemo(() => {
    if (!apiData) return { total: 0, completed: 0, confirmed: 0, cancelled: 0 };
    return {
      total: apiData.total,
      completed: apiData.appointments.filter((a) => a.status === "completed")
        .length,
      confirmed: apiData.appointments.filter((a) => a.status === "confirmed")
        .length,
      cancelled: apiData.appointments.filter((a) => a.status === "cancelled")
        .length,
    };
  }, [apiData]);
  if (loadingList && apiData?.appointments?.length === 0) return <Loading />;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lịch sử khám bệnh
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý lịch sử các cuộc hẹn khám bệnh của bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng số lượt khám
                </p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary/60" />
            </div>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-500/5 to-green-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã hoàn thành
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/60" />
            </div>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã xác nhận
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.confirmed}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500/60" />
            </div>
          </Card>
          <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-red-500/5 to-red-500/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Đã hủy
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500/60" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <AppointmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
        />

        <AppointmentList
          appointments={apiData?.appointments || []}
          total={apiData?.total || 0}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          // className="animate-fade-in"
        />
      </div>
    </div>
  );
}
