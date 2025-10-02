"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar, Activity, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import useDebounce from "@/hooks/use-debounce"

interface Filters {
  status: string
  dateRange: string
  search: string
}

interface AppointmentFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  showAdvanced: boolean
  setShowAdvanced: (value: boolean) => void
  isSearching?: boolean
  onSearchChange: (value: string) => void
}

export default function AppointmentFilters({
  filters,
  onFilterChange,
  showAdvanced,
  setShowAdvanced,
  isSearching = false,
  onSearchChange,
}: AppointmentFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search)
  const debouncedSearch = useDebounce(localSearch, 500)
  const searchRef = useRef(filters.search)

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "completed", label: "Đã hoàn thành" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "cancelled", label: "Đã hủy" },
  ]

  const dateRangeOptions = [
    { value: "all", label: "Tất cả" },
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "year", label: "Năm này" },
  ]

  const handleFilterChange = useCallback(
    (key: keyof Filters, value: string) => {
      onFilterChange({ ...filters, [key]: value })
    },
    [filters, onFilterChange]
  )

  const clearFilters = () => {
    onFilterChange({ status: "all", dateRange: "all", search: "" })
    setLocalSearch("")
  }

  // Update parent search after debounce
  useEffect(() => {
    if (debouncedSearch !== searchRef.current) {
      searchRef.current = debouncedSearch
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, onSearchChange])

  return (
    <Card className="border-0 shadow-md mb-6">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Bộ lọc và tìm kiếm</h3>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isSearching ? "Đang tìm kiếm..." : "Tìm kiếm theo tên bác sĩ, khoa, chẩn đoán..."}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 pr-10 border-0 bg-muted/50"
            autoComplete="off"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Toggle advanced */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-primary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? (
              <>
                <ChevronUp className="h-4 w-4" /> Ẩn tìm kiếm nâng cao
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> Tìm kiếm nâng cao
              </>
            )}
          </Button>

          <Button variant="outline" onClick={clearFilters} className="bg-transparent">
            Xóa bộ lọc
          </Button>
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="space-y-6 mt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Trạng thái
              </h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.status === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("status", option.value)}
                    className={filters.status === option.value ? "bg-primary text-primary-foreground" : "bg-transparent"}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Mốc thời gian
              </h4>
              <div className="flex flex-wrap gap-2">
                {dateRangeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.dateRange === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("dateRange", option.value)}
                    className={filters.dateRange === option.value ? "bg-primary text-primary-foreground" : "bg-transparent"}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
