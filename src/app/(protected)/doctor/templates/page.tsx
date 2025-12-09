"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import {
  PrescriptionTemplate,
  CreateTemplateRequest,
  TemplateItemInput,
} from "@/types/medicine";
import { PrescriptionBuilder } from "../examination/components/prescription-builder";
import type { PrescriptionItem } from "@/types/examination";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<PrescriptionTemplate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<PrescriptionTemplate | null>(null);

  // Form state
  const [templateName, setTemplateName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getDoctorTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Lỗi tải mẫu đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingTemplate(null);
    setTemplateName("");
    setDiagnosis("");
    setNotes("");
    setItems([]);
    setDialogOpen(true);
  };

  const openEditDialog = (template: PrescriptionTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.templateName);
    setDiagnosis(template.diagnosis || "");
    setNotes(template.notes || "");

    // Convert template items to PrescriptionItem format
    const prescriptionItems: PrescriptionItem[] = template.items.map((item) => ({
      drugId: item.drugId.toString(),
      drugName: item.drugName,
      activeIngredient: item.activeIngredient,
      strength: item.strength,
      dosage: item.dosage,
      instructions: item.timing || item.frequency,
      duration: item.durationDays || 0,
      quantity: 0,
    }));

    setItems(prescriptionItems);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      alert("Vui lòng nhập tên mẫu đơn");
      return;
    }

    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất một loại thuốc");
      return;
    }

    try {
      setSaving(true);

      // Convert PrescriptionItem[] to TemplateItemInput[]
      const templateItems: TemplateItemInput[] = items.map((item) => ({
        drugId: Number(item.drugId),
        dosage: item.dosage,
        frequency: item.dosage, // Using dosage as frequency for now
        route: "Uống",
        timing: item.instructions,
        durationDays: item.duration,
        specialInstructions: item.instructions,
      }));

      const requestData: CreateTemplateRequest = {
        templateName: templateName.trim(),
        diagnosis: diagnosis.trim() || undefined,
        notes: notes.trim() || undefined,
        items: templateItems,
      };

      if (editingTemplate) {
        // Update existing template
        await medicineService.updateTemplate(editingTemplate.id, requestData);
        console.log("✅ Template updated:", templateName);
      } else {
        // Create new template
        await medicineService.createTemplate(requestData);
        console.log("✅ Template created:", templateName);
      }

      setDialogOpen(false);
      fetchTemplates(); // Refresh list
    } catch (error) {
      console.error("Lỗi lưu mẫu đơn:", error);
      const errorMessage =
        error instanceof Error && 'response' in error
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Có lỗi xảy ra")
          : "Có lỗi xảy ra khi lưu mẫu đơn";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await medicineService.deleteTemplate(templateToDelete.id);
      console.log("✅ Template deleted:", templateToDelete.templateName);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
      fetchTemplates(); // Refresh list
    } catch (error) {
      console.error("Lỗi xóa mẫu đơn:", error);
      alert("Có lỗi xảy ra khi xóa mẫu đơn");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý mẫu đơn thuốc</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các mẫu đơn thuốc thường dùng
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo mẫu đơn mới
        </Button>
      </div>

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có mẫu đơn nào</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tạo mẫu đơn đầu tiên để sử dụng nhanh khi khám bệnh
            </p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo mẫu đơn
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {template.templateName}
                    </h3>
                    {template.diagnosis && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.diagnosis}
                      </p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{template.totalDrugs} loại thuốc</span>
                  </div>

                  {template.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.notes}
                    </p>
                  )}

                  <div className="pt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setTemplateToDelete(template);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Chỉnh sửa mẫu đơn" : "Tạo mẫu đơn mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="templateName">
                Tên mẫu đơn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="VD: Đơn cảm cúm thông thường"
              />
            </div>

            <div>
              <Label htmlFor="diagnosis">Chẩn đoán</Label>
              <Input
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="VD: Nhiễm khuẩn đường hô hấp trên"
              />
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú bổ sung cho mẫu đơn này..."
                rows={2}
              />
            </div>

            <div>
              <Label>
                Danh sách thuốc <span className="text-red-500">*</span>
              </Label>
              <PrescriptionBuilder
                selectedItems={items}
                onUpdate={setItems}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu mẫu đơn"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Xác nhận xóa mẫu đơn
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa mẫu đơn &ldquo;
            <strong>{templateToDelete?.templateName}</strong>&rdquo;? Hành động này
            không thể hoàn tác.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setTemplateToDelete(null);
              }}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa mẫu đơn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
