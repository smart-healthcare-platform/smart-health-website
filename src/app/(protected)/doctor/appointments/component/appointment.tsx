import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone } from "lucide-react"

export function AppointmentsList() {
  const appointments = [
    {
      id: 1,
      time: "08:00 - 08:30",
      patient: "Nguyễn Thị Lan",
      phone: "0901234567",
      type: "Khám định kỳ",
      status: "confirmed",
      notes: "Kiểm tra huyết áp",
    },
    {
      id: 2,
      time: "08:30 - 09:00",
      patient: "Trần Văn Nam",
      phone: "0912345678",
      type: "Tái khám",
      status: "confirmed",
      notes: "Theo dõi sau phẫu thuật",
    },
    {
      id: 3,
      time: "09:00 - 09:30",
      patient: "Lê Thị Hoa",
      phone: "0923456789",
      type: "Khám mới",
      status: "pending",
      notes: "Đau ngực, khó thở",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Hôm nay
          </Button>
          <Button variant="ghost" size="sm">
            Tuần này
          </Button>
          <Button variant="ghost" size="sm">
            Tháng này
          </Button>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Thêm lịch hẹn</Button>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {appointment.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{appointment.patient}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {appointment.phone}
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline">{appointment.type}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">{appointment.notes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {appointment.status === "confirmed" ? (
                    <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>
                  ) : (
                    <Badge variant="secondary">Chờ xác nhận</Badge>
                  )}
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
