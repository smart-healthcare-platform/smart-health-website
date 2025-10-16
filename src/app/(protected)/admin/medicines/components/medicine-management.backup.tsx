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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Package,
  Factory,
  Tag,
  Boxes,
} from "lucide-react"

// Mock data for medicine list
const medicinesData = [
  {
    id: "DRG-001",
    name: "Paracetamol 500mg",
    category: "Giảm đau, hạ sốt",
    manufacturer: "Pharmacity",
    stock: 1200,
    price: 15000,
    status: "in_stock",
    code: "PARA500",
  },
  {
    id: "DRG-002",
    name: "Amoxicillin 250mg",
    category: "Kháng sinh",
    manufacturer: "Long Châu",
    stock: 800,
    price: 85000,
    status: "in_stock",
    code: "AMOX250",
  },
  {
    id: "DRG-003",
    name: "Loratadine 10mg",
    category: "Kháng Histamin",
    manufacturer: "An Khang",
    stock: 0,
    price: 45000,
    status: "out_of_stock",
    code: "LORA10",
  },
  {
    id: "DRG-004",
    name: "Omeprazole 20mg",
    category: "Dạ dày",
    manufacturer: "Pharmacity",
    stock: 500,
    price: 32000,
    status: "low_stock",
    code: "OMEP20",
  },
  {
    id: "DRG-005",
    name: "Berberin 10mg",
    category: "Tiêu hóa",
    manufacturer: "Long Châu",
    stock: 2500,
    price: 8000,
    status: "in_stock",
    code: "BERB10",
  },
]

const statsData = [
  { title: "Tổng số thuốc", value: "1,482", icon: Package },
  { title: "Nhà cung cấp", value: "3", icon: Factory },
  { title: "Danh mục", value: "24", icon: Tag },
  { title: "Sắp hết hàng", value: "15", icon: Boxes },
]

export function MedicineManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [manufacturerFilter, setManufacturerFilter] = useState("all")

  const filteredMedicines = medicinesData.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || med.status === statusFilter
    const matchesManufacturer = manufacturerFilter === "all" || med.manufacturer === manufacturerFilter
    return matchesSearch && matchesStatus && matchesManufacturer
  })

  const manufacturers = [...new Set(medicinesData.map((med) => med.manufacturer))]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="default">Còn hàng</Badge>
      case "low_stock":
        return <Badge variant="secondary">Sắp hết</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Hết hàng</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Thuốc</h1>
          <p className="text-muted-foreground">Xem và quản lý danh mục thuốc từ các nhà cung cấp.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Xuất file
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Thêm thuốc
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Danh mục thuốc</CardTitle>
          <CardDescription>Danh sách chi tiết các loại thuốc hiện có.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4 mb-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên, mã, danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="in_stock">Còn hàng</SelectItem>
                  <SelectItem value="low_stock">Sắp hết</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
              <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhà cung cấp</SelectItem>
                  {manufacturers.map((man) => (
                    <SelectItem key={man} value={man}>
                      {man}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Medicine Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Mã thuốc</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.code}</TableCell>
                    <TableCell>{med.category}</TableCell>
                    <TableCell>{med.manufacturer}</TableCell>
                    <TableCell>{med.stock.toLocaleString()}</TableCell>
                    <TableCell>{med.price.toLocaleString('vi-VN')} ₫</TableCell>
                    <TableCell>{getStatusBadge(med.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredMedicines.length} trên {medicinesData.length} thuốc.
            </div>
            {/* Pagination component can be added here */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
