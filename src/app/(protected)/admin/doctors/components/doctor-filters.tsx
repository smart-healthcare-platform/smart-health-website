"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface DoctorFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
}

export function DoctorFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: DoctorFiltersProps) {
  return (
    <div className="flex items-center justify-between space-x-4 mb-6">
      <div className="flex items-center space-x-4 flex-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bác sĩ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Bộ lọc khác
      </Button>
    </div>
  )
}
