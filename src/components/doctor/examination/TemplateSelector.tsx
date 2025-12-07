"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2 } from "lucide-react";
import { medicineService } from "@/services/medicine.service";
import { PrescriptionTemplate } from "@/types/medicine";

interface TemplateSelectorProps {
  onSelectTemplate: (template: PrescriptionTemplate) => void;
  disabled?: boolean;
}

export function TemplateSelector({
  onSelectTemplate,
  disabled = false,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");

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

  const handleSelectChange = (value: string) => {
    setSelectedId(value);
    const template = templates.find((t) => t.id.toString() === value);
    if (template) {
      onSelectTemplate(template);
      // Reset selection sau khi apply
      setTimeout(() => setSelectedId(""), 100);
    }
  };

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Đang tải mẫu đơn...
      </Button>
    );
  }

  if (templates.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="text-muted-foreground"
      >
        <FileText className="h-4 w-4 mr-2" />
        Chưa có mẫu đơn
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <FileText className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedId}
        onValueChange={handleSelectChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Chọn mẫu đơn..." />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id.toString()}>
              <div className="flex flex-col">
                <span className="font-medium">{template.templateName}</span>
                {template.diagnosis && (
                  <span className="text-xs text-muted-foreground">
                    {template.diagnosis}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-xs text-muted-foreground">
        {templates.length} mẫu
      </span>
    </div>
  );
}
