import { Search, Calendar, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

export function RecordFilters() {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Tìm kiếm theo tên bệnh nhân, mã bệnh án..." className="pl-10 bg-white border-gray-200" />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="pending">Đang xử lý</SelectItem>
              <SelectItem value="follow-up">Tái khám</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Chuyên khoa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="cardiology">Tim mạch</SelectItem>
              <SelectItem value="neurology">Thần kinh</SelectItem>
              <SelectItem value="orthopedics">Chấn thương chỉnh hình</SelectItem>
              <SelectItem value="pediatrics">Nhi khoa</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="bg-white">
            <Calendar className="h-4 w-4 mr-2" />
            Ngày khám
          </Button>

          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>
    </Card>
  )
}
