"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface FollowUpStepProps {
  data?: {
    suggestedDate?: string
    reason?: string
  }
  onUpdate: (data: { suggestedDate?: string; reason?: string }) => void
  onNext: () => void
  onPrevious: () => void
}

export function FollowUpStep({ data, onUpdate, onNext, onPrevious }: FollowUpStepProps) {
  const [suggestedDate, setSuggestedDate] = useState(data?.suggestedDate || "")
  const [reason, setReason] = useState(data?.reason || "")

  // Calculate default follow-up date (7 days from now)
  useEffect(() => {
    if (!suggestedDate) {
      const defaultDate = new Date()
      defaultDate.setDate(defaultDate.getDate() + 7)
      const formattedDate = format(defaultDate, "yyyy-MM-dd")
      setSuggestedDate(formattedDate)
      onUpdate({ suggestedDate: formattedDate, reason })
    }
  }, [])

  const handleDateChange = (date: string) => {
    setSuggestedDate(date)
    onUpdate({ suggestedDate: date, reason })
  }

  const handleReasonChange = (text: string) => {
    setReason(text)
    onUpdate({ suggestedDate, reason: text })
  }

  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "EEEE, dd/MM/yyyy", { locale: vi })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold">Đề xuất tái khám</h2>
        <p className="text-sm text-muted-foreground">
          Đề xuất lịch tái khám cho bệnh nhân (tùy chọn)
        </p>
      </div>

      <div className="space-y-6">
        {/* Suggested Date */}
        <div className="space-y-3">
          <Label htmlFor="suggestedDate" className="text-base font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ngày tái khám đề xuất
          </Label>
          <div className="space-y-2">
            <Input
              id="suggestedDate"
              type="date"
              value={suggestedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="text-base"
              min={format(new Date(), "yyyy-MM-dd")}
            />
            {suggestedDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Ngày đề xuất:</strong> {formatDisplayDate(suggestedDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-3">
          <Label htmlFor="reason" className="text-base font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Lý do tái khám
          </Label>
          <Textarea
            id="reason"
            placeholder="Nhập lý do tái khám (ví dụ: Kiểm tra tiến triển, theo dõi tác dụng phụ của thuốc, xét nghiệm định kỳ...)"
            value={reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            className="min-h-[120px] text-base resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Lý do tái khám sẽ giúp bệnh nhân hiểu rõ mục đích của cuộc hẹn tiếp theo
          </p>
        </div>

        {/* Quick Options */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Tùy chọn nhanh:</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() + 7)
                const formattedDate = format(date, "yyyy-MM-dd")
                handleDateChange(formattedDate)
                handleReasonChange("Kiểm tra tiến triển sau 1 tuần")
              }}
              className="text-xs"
            >
              1 tuần
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() + 14)
                const formattedDate = format(date, "yyyy-MM-dd")
                handleDateChange(formattedDate)
                handleReasonChange("Kiểm tra tiến triển sau 2 tuần")
              }}
              className="text-xs"
            >
              2 tuần
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const date = new Date()
                date.setMonth(date.getMonth() + 1)
                const formattedDate = format(date, "yyyy-MM-dd")
                handleDateChange(formattedDate)
                handleReasonChange("Tái khám định kỳ sau 1 tháng")
              }}
              className="text-xs"
            >
              1 tháng
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const date = new Date()
                date.setMonth(date.getMonth() + 3)
                const formattedDate = format(date, "yyyy-MM-dd")
                handleDateChange(formattedDate)
                handleReasonChange("Tái khám định kỳ sau 3 tháng")
              }}
              className="text-xs"
            >
              3 tháng
            </Button>
          </div>
        </div>

        {/* Skip Option */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">Không cần tái khám</p>
              <p className="text-xs text-gray-600">
                Nếu bệnh nhân không cần tái khám, bạn có thể bỏ qua bước này
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSuggestedDate("")
                  setReason("")
                  onUpdate({ suggestedDate: "", reason: "" })
                }}
                className="text-xs text-gray-600 hover:text-gray-800 p-0 h-auto"
              >
                Bỏ qua đề xuất tái khám
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Quay lại
        </Button>
        <Button onClick={onNext} size="lg">
          Tiếp tục
        </Button>
      </div>
    </div>
  )
}
