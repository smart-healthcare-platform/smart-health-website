"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, Calendar, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Doctor } from "@/types/doctor/doctor.type"
import { calculateAge, formatDate } from "@/lib/format"

interface DoctorTableProps {
  doctors: Doctor[]
}



export function DoctorTable({ doctors }: DoctorTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bác sĩ</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Giới tính</TableHead>
            <TableHead>Ngày sinh</TableHead>
            <TableHead>Kinh nghiệm</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              {/* Avatar + Tên */}
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.display_name} />
                    <AvatarFallback>
                      {doctor.display_name.split(" ").slice(-2).map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{doctor.display_name}</div>
                  </div>
                </div>
              </TableCell>

              {/* Liên hệ */}
              <TableCell>
                <div className="text-sm">
                  <div className="text-muted-foreground">{doctor.phone}</div>
                </div>
              </TableCell>

              {/* Giới tính */}
              <TableCell>
                {doctor.gender === "FEMALE" ? "Nữ" : doctor.gender === "MALE" ? "Nam" : "Khác"}
              </TableCell>

              {/* Ngày sinh + Tuổi */}
              <TableCell>
                <div className="text-sm">
                  {formatDate(doctor.date_of_birth)}
                  <div className="text-xs text-muted-foreground">({calculateAge(doctor.date_of_birth)} tuổi)</div>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm">{doctor.experience_years} năm</div>
              </TableCell>

              <TableCell>
                <Badge variant={doctor.active ? "default" : "secondary"}>
                  {doctor.active ? "Hoạt động" : "Ngưng hoạt động"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem hồ sơ
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Lịch làm việc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa bác sĩ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
