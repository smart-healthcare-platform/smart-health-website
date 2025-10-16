"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pill,
  Search,
  Trash2,
  Edit2,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { medicineService } from "@/services/medicine.service"
import { Drug, StockStatus } from "@/types/medicine"
import type { PrescriptionItem } from "@/types/examination"

interface PrescriptionBuilderProps {
  selectedItems: PrescriptionItem[]
  onUpdate: (items: PrescriptionItem[]) => void
}

export function PrescriptionBuilder({ selectedItems, onUpdate }: PrescriptionBuilderProps) {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [loadingDrugs, setLoadingDrugs] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [popoverOpen, setPopoverOpen] = useState(false)
  
  // Dialog state cho Add/Edit
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PrescriptionItem | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    quantity: 1,
    dosage: "",
    duration: 7,
    instructions: "",
    notes: "",
  })

  // Search drugs với debounce
  useEffect(() => {
    if (!searchTerm) {
      setDrugs([])
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoadingDrugs(true)
        const result = await medicineService.searchDrugs(searchTerm)
        setDrugs(result)
      } catch (error) {
        console.error("Error searching drugs:", error)
      } finally {
        setLoadingDrugs(false)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Get stock status badge
  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case StockStatus.IN_STOCK:
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Còn hàng
          </Badge>
        )
      case StockStatus.LOW_STOCK:
        return (
          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Sắp hết
          </Badge>
        )
      case StockStatus.OUT_OF_STOCK:
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Hết hàng
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Handle select drug from search
  const handleSelectDrug = (drug: Drug) => {
    // Reset form với default values
    setFormData({
      quantity: 1,
      dosage: "",
      duration: 7,
      instructions: "",
      notes: "",
    })
    
    setEditingItem({
      drugId: drug.id.toString(), // Convert number to string
      drugName: drug.name,
      activeIngredient: drug.activeIngredient,
      strength: drug.strength,
      quantity: 1,
      dosage: "",
      duration: 7,
      instructions: "",
    })
    
    setEditingIndex(null)
    setDialogOpen(true)
    setPopoverOpen(false)
    setSearchTerm("")
  }

  // Handle edit existing item
  const handleEditItem = (item: PrescriptionItem, index: number) => {
    setEditingItem(item)
    setEditingIndex(index)
    setFormData({
      quantity: item.quantity,
      dosage: item.dosage,
      duration: item.duration,
      instructions: item.instructions,
      notes: item.notes || "",
    })
    setDialogOpen(true)
  }

  // Handle save item
  const handleSaveItem = () => {
    if (!editingItem) return

    // Validate
    if (!formData.dosage.trim()) {
      alert("Vui lòng nhập liều lượng")
      return
    }
    if (!formData.instructions.trim()) {
      alert("Vui lòng nhập hướng dẫn sử dụng")
      return
    }
    if (formData.quantity < 1) {
      alert("Số lượng phải lớn hơn 0")
      return
    }
    if (formData.duration < 1) {
      alert("Thời gian dùng phải lớn hơn 0")
      return
    }

    const newItem: PrescriptionItem = {
      ...editingItem,
      quantity: formData.quantity,
      dosage: formData.dosage.trim(),
      duration: formData.duration,
      instructions: formData.instructions.trim(),
      notes: formData.notes.trim() || undefined,
    }

    let updatedItems: PrescriptionItem[]
    
    if (editingIndex !== null) {
      // Edit existing
      updatedItems = [...selectedItems]
      updatedItems[editingIndex] = newItem
    } else {
      // Add new
      // Check if drug already exists
      const exists = selectedItems.some(item => item.drugId === newItem.drugId)
      if (exists) {
        alert("Thuốc này đã có trong đơn")
        return
      }
      updatedItems = [...selectedItems, newItem]
    }

    onUpdate(updatedItems)
    handleCloseDialog()
  }

  // Handle delete item
  const handleDeleteItem = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index)
    onUpdate(updatedItems)
  }

  // Handle close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingItem(null)
    setEditingIndex(null)
    setFormData({
      quantity: 1,
      dosage: "",
      duration: 7,
      instructions: "",
      notes: "",
    })
  }

  return (
    <div className="space-y-4">
      {/* Search & Add Drug */}
      <div className="flex gap-2">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-start">
              <Search className="w-4 h-4 mr-2" />
              {searchTerm || "Tìm và thêm thuốc..."}
            </Button>
          </PopoverTrigger>

          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0" 
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Nhập tên thuốc hoặc hoạt chất..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              
              <CommandEmpty>
                {loadingDrugs ? "Đang tìm kiếm..." : "Không tìm thấy thuốc"}
              </CommandEmpty>

              <CommandGroup className="max-h-[300px] overflow-y-auto">
                {drugs.map((drug) => (
                  <CommandItem
                    key={drug.id}
                    onSelect={() => handleSelectDrug(drug)}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                  >
                    <Package className="w-4 h-4 mt-1 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{drug.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {drug.activeIngredient} - {drug.strength}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(drug.stockStatus)}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Selected Items Table */}
      {selectedItems.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Tên thuốc</TableHead>
                  <TableHead className="w-[150px]">Liều lượng</TableHead>
                  <TableHead className="w-[100px]">Số lượng</TableHead>
                  <TableHead className="w-[100px]">Thời gian</TableHead>
                  <TableHead className="w-[80px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{item.drugName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.activeIngredient} - {item.strength}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.dosage}</TableCell>
                    <TableCell className="text-sm">{item.quantity}</TableCell>
                    <TableCell className="text-sm">{item.duration} ngày</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditItem(item, index)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <Pill className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Chưa có thuốc nào trong đơn
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Nhấn nút tìm kiếm ở trên để thêm thuốc
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Chỉnh sửa thuốc" : "Thêm thuốc vào đơn"}
            </DialogTitle>
            <DialogDescription>
              {editingItem && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">{editingItem.drugName}</p>
                  <p className="text-sm">
                    {editingItem.activeIngredient} - {editingItem.strength}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Quantity & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Số lượng <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="20"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Số lượng (viên/vỉ/hộp)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Thời gian dùng <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="7"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">Số ngày sử dụng</p>
              </div>
            </div>

            {/* Dosage */}
            <div className="space-y-2">
              <Label htmlFor="dosage">
                Liều lượng <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dosage"
                placeholder="VD: 1 viên x 2 lần/ngày"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Cách dùng: số lượng x số lần/ngày
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions">
                Hướng dẫn sử dụng <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="instructions"
                placeholder="VD: Uống sau ăn 30 phút, uống cùng nước"
                rows={3}
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú thêm (tùy chọn)</Label>
              <Textarea
                id="notes"
                placeholder="Các lưu ý đặc biệt, cảnh báo..."
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Hủy
            </Button>
            <Button onClick={handleSaveItem}>
              {editingIndex !== null ? "Cập nhật" : "Thêm vào đơn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
