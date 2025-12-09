"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface PatientFiltersProps {
  searchTerm: string
  onSearchChange: (val: string) => void
}

export default function PatientFilters({ searchTerm, onSearchChange }: PatientFiltersProps) {
  return (
    <div className="flex items-center justify-between space-x-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm bệnh nhân..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Bộ lọc nâng cao
      </Button>
    </div>
  )
}
