"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Drug, StockStatus } from "@/types/medicine"
import { Package, Pill, Activity, Database } from "lucide-react"

interface DrugDetailDialogProps {
  drug: Drug | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DrugDetailDialog({ drug, open, onOpenChange }: DrugDetailDialogProps) {
  if (!drug) return null

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

  const getStatusColor = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK:
        return "text-green-600"
      case StockStatus.LOW_STOCK:
        return "text-yellow-600"
      case StockStatus.OUT_OF_STOCK:
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Chi tiết Thuốc
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết từ nhà thuốc partner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mã thuốc</p>
                <p className="text-lg font-mono font-semibold">#{drug.id}</p>
              </div>
              <div>
                {getStatusBadge(drug.stockStatus)}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4">
              {/* Tên thuốc */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Pill className={`h-5 w-5 ${getStatusColor(drug.stockStatus)}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Tên thuốc</p>
                  <p className="text-lg font-semibold">{drug.name}</p>
                </div>
              </div>

              {/* Hoạt chất */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Hoạt chất</p>
                  <p className="text-base font-medium">{drug.activeIngredient}</p>
                </div>
              </div>

              {/* Hàm lượng */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Hàm lượng</p>
                  <p className="text-base font-medium">{drug.strength}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Status Detail */}
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-semibold text-sm">Trạng thái tồn kho</h4>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${
                drug.stockStatus === StockStatus.IN_STOCK ? 'bg-green-500' :
                drug.stockStatus === StockStatus.LOW_STOCK ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className="text-sm">
                {drug.stockStatus === StockStatus.IN_STOCK && 'Thuốc hiện đang có sẵn tại nhà thuốc'}
                {drug.stockStatus === StockStatus.LOW_STOCK && 'Thuốc sắp hết hàng, cần liên hệ nhà thuốc để xác nhận'}
                {drug.stockStatus === StockStatus.OUT_OF_STOCK && 'Thuốc hiện đang hết hàng tại nhà thuốc'}
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Lưu ý:</span> Dữ liệu được đồng bộ từ nhà thuốc partner. 
              Để cập nhật thông tin mới nhất, vui lòng sử dụng chức năng &ldquo;Làm mới&rdquo; trên trang danh mục.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
