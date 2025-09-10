import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Download, Eye, Plus } from "lucide-react"

const medicalRecords = [
  {
    id: 1,
    patientName: "Nguyễn Thị Lan",
    recordType: "Khám tổng quát",
    date: "2024-01-15",
    diagnosis: "Cao huyết áp độ 1",
    status: "Hoàn thành",
    doctor: "Bác sĩ Nguyễn Văn A",
  },
  {
    id: 2,
    patientName: "Trần Văn Minh",
    recordType: "Xét nghiệm máu",
    date: "2024-01-12",
    diagnosis: "Đái tháo đường type 2",
    status: "Đang xử lý",
    doctor: "Bác sĩ Nguyễn Văn A",
  },
  {
    id: 3,
    patientName: "Lê Thị Hoa",
    recordType: "Siêu âm tim",
    date: "2024-01-10",
    diagnosis: "Rối loạn nhịp tim",
    status: "Cần tái khám",
    doctor: "Bác sĩ Nguyễn Văn A",
  },
]

const recentTests = [
  {
    id: 1,
    patientName: "Nguyễn Thị Lan",
    testType: "Xét nghiệm máu",
    date: "2024-01-14",
    result: "Bình thường",
    status: "Có kết quả",
  },
  {
    id: 2,
    patientName: "Trần Văn Minh",
    testType: "HbA1c",
    date: "2024-01-13",
    result: "7.2%",
    status: "Có kết quả",
  },
]

export default function MedicalRecordsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hồ sơ Bệnh án</h1>
          <p className="text-muted-foreground">Quản lý hồ sơ bệnh án và kết quả xét nghiệm</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo hồ sơ mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm hồ sơ</CardTitle>
          <CardDescription>Tìm kiếm theo tên bệnh nhân, loại khám hoặc chẩn đoán</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Nhập tên bệnh nhân, loại khám hoặc chẩn đoán..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Hồ sơ bệnh án</TabsTrigger>
          <TabsTrigger value="tests">Kết quả xét nghiệm</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {medicalRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">{record.patientName}</h3>
                      <Badge variant="outline">{record.recordType}</Badge>
                    </div>
                    <p className="text-muted-foreground">Chẩn đoán: {record.diagnosis}</p>
                    <p className="text-sm text-muted-foreground">
                      Ngày khám: {new Date(record.date).toLocaleDateString("vi-VN")} • {record.doctor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        record.status === "Hoàn thành"
                          ? "default"
                          : record.status === "Cần tái khám"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {record.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Xem
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Tải về
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {recentTests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">{test.patientName}</h3>
                      <Badge variant="outline">{test.testType}</Badge>
                    </div>
                    <p className="text-muted-foreground">Kết quả: {test.result}</p>
                    <p className="text-sm text-muted-foreground">
                      Ngày xét nghiệm: {new Date(test.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{test.status}</Badge>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Tải về
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
