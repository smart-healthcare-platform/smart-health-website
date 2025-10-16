"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Package,
  AlertTriangle,
  RefreshCw,
  Database,
} from "lucide-react"
import { useDrugs } from "@/hooks/use-drugs"
import { StockStatus, Drug } from "@/types/medicine"
import { DrugDetailDialog } from "./drug-detail-dialog"

export function DrugCatalogViewer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Use custom hook để fetch drugs
  const { drugs, loading, error, filters, updateFilters, refresh, stats } = useDrugs()

  // Handle search với debounce effect
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // Có thể thêm debounce ở đây nếu cần
    const timeoutId = setTimeout(() => {
      updateFilters({ search: value })
    }, 500)
    return () => clearTimeout(timeoutId)
  }

  // Handle stock status filter
  const handleStockFilterChange = (value: string) => {
    updateFilters({ 
      stockStatus: value === "all" ? "all" : value as StockStatus 
    })
  }

  // Get stock status badge
  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK:
        return <Badge className="bg-green-500 hover:bg-green-600">Còn hàng</Badge>
      case StockStatus.LOW_STOCK:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Sắp hết</Badge>
      case StockStatus.OUT_OF_STOCK:
        return <Badge variant="destructive">Hết hàng</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Handle view detail
  const handleViewDetail = (drug: Drug) => {
    setSelectedDrug(drug)
    setDetailDialogOpen(true)
  }

  // Handle export (TODO: implement export logic)
  const handleExport = () => {
    // TODO: Implement export to CSV/Excel
    alert("Chức năng xuất file đang được phát triển")
  }

  const statsData = [
    { 
      title: "Tổng số thuốc", 
      value: stats.total.toString(), 
      icon: Package,
      color: "text-blue-500"
    },
    { 
      title: "Còn hàng", 
      value: stats.inStock.toString(), 
      icon: Database,
      color: "text-green-500"
    },
    { 
      title: "Sắp hết hàng", 
      value: stats.lowStock.toString(), 
      icon: AlertTriangle,
      color: "text-yellow-500"
    },
    { 
      title: "Hết hàng", 
      value: stats.outOfStock.toString(), 
      icon: AlertTriangle,
      color: "text-red-500"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh mục Thuốc</h1>
          <p className="text-muted-foreground">
            Danh mục thuốc từ nhà thuốc partner (Read-only)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất file
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thuốc</CardTitle>
          <CardDescription>
            Dữ liệu được đồng bộ từ các nhà thuốc partner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên thuốc, hoạt chất..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select 
                value={filters.stockStatus || "all"} 
                onValueChange={handleStockFilterChange}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value={StockStatus.IN_STOCK}>Còn hàng</SelectItem>
                  <SelectItem value={StockStatus.LOW_STOCK}>Sắp hết</SelectItem>
                  <SelectItem value={StockStatus.OUT_OF_STOCK}>Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              <p className="font-semibold">Lỗi: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refresh}
                className="mt-2"
              >
                Thử lại
              </Button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Đang tải dữ liệu...</span>
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên thuốc</TableHead>
                      <TableHead>Hoạt chất</TableHead>
                      <TableHead>Hàm lượng</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drugs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Không tìm thấy thuốc nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      drugs.map((drug) => (
                        <TableRow key={drug.id}>
                          <TableCell className="font-mono text-sm">{drug.id}</TableCell>
                          <TableCell className="font-medium">{drug.name}</TableCell>
                          <TableCell>{drug.activeIngredient}</TableCell>
                          <TableCell>{drug.strength}</TableCell>
                          <TableCell>{getStatusBadge(drug.stockStatus)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetail(drug)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Info */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {drugs.length} thuốc.
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Drug Detail Dialog */}
      <DrugDetailDialog
        drug={selectedDrug}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  )
}
