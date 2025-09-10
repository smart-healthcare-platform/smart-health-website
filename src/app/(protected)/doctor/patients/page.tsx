import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Phone, Mail, Calendar, FileText } from "lucide-react"

const patients = [
  {
    id: 1,
    name: "Nguyễn Thị Lan",
    age: 45,
    phone: "0901234567",
    email: "lan.nguyen@email.com",
    lastVisit: "2024-01-15",
    condition: "Cao huyết áp",
    status: "Đang điều trị",
    avatar: "/middle-aged-woman.jpg",
  },
  {
    id: 2,
    name: "Trần Văn Minh",
    age: 38,
    phone: "0912345678",
    email: "minh.tran@email.com",
    lastVisit: "2024-01-12",
    condition: "Đái tháo đường",
    status: "Ổn định",
    avatar: "/middle-aged-man.jpg",
  },
  {
    id: 3,
    name: "Lê Thị Hoa",
    age: 52,
    phone: "0923456789",
    email: "hoa.le@email.com",
    lastVisit: "2024-01-10",
    condition: "Bệnh tim",
    status: "Cần theo dõi",
    avatar: "/older-woman.jpg",
  },
]

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Bệnh nhân</h1>
          <p className="text-muted-foreground">Danh sách và thông tin bệnh nhân của bạn</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm bệnh nhân mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm bệnh nhân</CardTitle>
          <CardDescription>Tìm kiếm theo tên, số điện thoại hoặc email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Nhập tên bệnh nhân, số điện thoại hoặc email..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-muted-foreground">Tuổi: {patient.age}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {patient.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      patient.status === "Ổn định"
                        ? "default"
                        : patient.status === "Cần theo dõi"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {patient.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lần khám cuối: {new Date(patient.lastVisit).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-sm font-medium mt-1">{patient.condition}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Đặt lịch khám
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  Xem hồ sơ
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Phone className="w-4 h-4" />
                  Liên hệ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
