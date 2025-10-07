import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Calendar, Award, Clock, Edit } from "lucide-react"

const doctorInfo = {
  name: "Bác sĩ Nguyễn Văn A",
  specialty: "Chuyên khoa Tim mạch",
  email: "nguyenvana@healthsmart.com",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  experience: "15 năm",
  education: "Đại học Y Hà Nội",
  certifications: ["Bác sĩ chuyên khoa I", "Chứng chỉ siêu âm tim", "Chứng chỉ can thiệp tim mạch"],
  workingHours: "8:00 - 17:00, Thứ 2 - Thứ 6",
  bio: "Bác sĩ chuyên khoa tim mạch với hơn 15 năm kinh nghiệm trong lĩnh vực chẩn đoán và điều trị các bệnh lý tim mạch. Tốt nghiệp xuất sắc tại Đại học Y Hà Nội và đã tham gia nhiều khóa đào tạo chuyên sâu tại nước ngoài.",
}

const statistics = [
  { label: "Tổng số bệnh nhân", value: "1,247", icon: User },
  { label: "Lịch khám tuần này", value: "28", icon: Calendar },
  { label: "Đánh giá trung bình", value: "4.9/5", icon: Award },
  { label: "Năm kinh nghiệm", value: "15+", icon: Clock },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hồ sơ Cá nhân</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>
        <Button className="gap-2">
          <Edit className="w-4 h-4" />
          Chỉnh sửa hồ sơ
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src="/caring-doctor.png" />
                  <AvatarFallback>BS</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{doctorInfo.name}</h3>
                  <p className="text-muted-foreground">{doctorInfo.specialty}</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Thay đổi ảnh
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
                <CardDescription>Thông tin cá nhân và nghề nghiệp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Họ và tên</label>
                    <Input value={doctorInfo.name} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Chuyên khoa</label>
                    <Input value={doctorInfo.specialty} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={doctorInfo.email} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input value={doctorInfo.phone} readOnly />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Địa chỉ</label>
                    <Input value={doctorInfo.address} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kinh nghiệm</label>
                    <Input value={doctorInfo.experience} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Giờ làm việc</label>
                    <Input value={doctorInfo.workingHours} readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Giới thiệu</label>
                  <Textarea value={doctorInfo.bio} readOnly rows={4} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bằng cấp & Chứng chỉ</CardTitle>
              <CardDescription>Trình độ học vấn và các chứng chỉ chuyên môn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Trình độ học vấn</label>
                  <Input value={doctorInfo.education} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Chứng chỉ chuyên môn</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {doctorInfo.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Quản lý các thông báo và cảnh báo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Thông báo lịch khám</p>
                    <p className="text-sm text-muted-foreground">Nhận thông báo về lịch khám sắp tới</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Bật
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Thông báo bệnh nhân mới</p>
                    <p className="text-sm text-muted-foreground">Thông báo khi có bệnh nhân mới đăng ký</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Bật
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Báo cáo hàng tuần</p>
                    <p className="text-sm text-muted-foreground">Nhận báo cáo tổng kết hoạt động hàng tuần</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Tắt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật tài khoản</CardTitle>
              <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Mật khẩu hiện tại</label>
                <Input type="password" placeholder="Nhập mật khẩu hiện tại" />
              </div>
              <div>
                <label className="text-sm font-medium">Mật khẩu mới</label>
                <Input type="password" placeholder="Nhập mật khẩu mới" />
              </div>
              <div>
                <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                <Input type="password" placeholder="Xác nhận mật khẩu mới" />
              </div>
              <Button className="w-full">Cập nhật mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
