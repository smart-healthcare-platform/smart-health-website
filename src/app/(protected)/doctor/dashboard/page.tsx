import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">+2 so với hôm qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bệnh nhân mới</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">8</div>
            <p className="text-xs text-muted-foreground">Tuần này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian khám TB</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">25p</div>
            <p className="text-xs text-muted-foreground">-3p so với tuần trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4.8</div>
            <p className="text-xs text-muted-foreground">⭐ Từ 156 đánh giá</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Lịch khám hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "08:00", patient: "Nguyễn Thị B", type: "Khám định kỳ", status: "completed" },
              { time: "08:30", patient: "Trần Văn C", type: "Tái khám", status: "completed" },
              { time: "09:00", patient: "Lê Thị D", type: "Khám mới", status: "current" },
              { time: "09:30", patient: "Phạm Văn E", type: "Khám định kỳ", status: "upcoming" },
              { time: "10:00", patient: "Hoàng Thị F", type: "Tư vấn", status: "upcoming" },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-muted-foreground min-w-[50px]">{appointment.time}</div>
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {appointment.status === "completed" && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Hoàn thành
                    </Badge>
                  )}
                  {appointment.status === "current" && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      Đang khám
                    </Badge>
                  )}
                  {appointment.status === "upcoming" && <Badge variant="outline">Sắp tới</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Thông báo quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Bệnh nhân cần theo dõi</h4>
                  <p className="text-sm text-yellow-700 mt-1">Bà Nguyễn Thị G cần tái khám sau 3 ngày điều trị</p>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Lịch họp khoa</h4>
                  <p className="text-sm text-blue-700 mt-1">Họp khoa Tim mạch - 14:00 ngày mai</p>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                    Thêm vào lịch
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Cập nhật hệ thống</h4>
                  <p className="text-sm text-green-700 mt-1">Tính năng chẩn đoán AI mới đã được cập nhật</p>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                    Tìm hiểu thêm
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
