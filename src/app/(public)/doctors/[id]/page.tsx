"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Star, GraduationCap, Phone, Mail, Shield, CheckCircle, HeartPulse } from "lucide-react"
import type { DoctorDetail } from "@/types"
import { doctorService } from "@/services/doctorService"
import Loading from "@/components/ui/loading"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation";
import { setDoctor } from "@/redux/slices/bookingSlice";
const dayTranslations: { [key: string]: string } = {
  mon: "Thứ 2",
  tue: "Thứ 3",
  wed: "Thứ 4",
  thu: "Thứ 5",
  fri: "Thứ 6",
  sat: "Thứ 7",
  sun: "Chủ nhật",
}

export default function DoctorDetailPage() {
  const params = useParams()
  const [doctorDetail, setDoctorDetail] = useState<DoctorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const doctorId = Array.isArray(params.id) ? params.id[0] : params.id
    if (!doctorId) return

    doctorService
      .getDoctorById(doctorId)
      .then(setDoctorDetail)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [params.id])

  const calculateAverageRating = (ratings: DoctorDetail["ratings"]) => {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  const formatDate = (dateInput: string | Date | null) => {
    if (!dateInput) return "—"
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 10) {
      return phone.substring(0, 3) + "****" + phone.substring(7)
    }
    return phone
  }

  if (loading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  if (!doctorDetail) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
          <p className="text-gray-600">Không tìm thấy thông tin bác sĩ</p>
        </div>
      </div>
    )
  }

  const degrees = doctorDetail.certificates.filter((cert) => cert.type === "degree")
  const licenses = doctorDetail.certificates.filter((cert) => cert.type === "license")

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Info bên trái */}
            <div className="flex items-center gap-6 flex-1">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="w-28 h-28 ring-4 ring-emerald-100 shadow-md">
                  <AvatarImage src={doctorDetail.avatar || "/placeholder.svg"} alt={doctorDetail.full_name} />
                  <AvatarFallback className="text-2xl bg-emerald-500 text-white">
                    {doctorDetail.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CheckCircle className="absolute bottom-1 right-1 w-7 h-7 text-green-500 bg-white rounded-full shadow-sm" />
              </div>

              {/* Thông tin bác sĩ */}
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">{doctorDetail.display_name}</h1>

                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                           bg-gradient-to-r from-emerald-500 to-emerald-600 
                           text-white font-medium shadow">
                    <HeartPulse className="w-4 h-4" />
                    {doctorDetail.specialty}
                  </span>
                  <span className="text-gray-700 font-medium">{doctorDetail.experience_years} năm kinh nghiệm</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-800 font-semibold">{calculateAverageRating(doctorDetail.ratings)}</span>
                    <span className="text-gray-500 text-sm">({doctorDetail.ratings.length} đánh giá)</span>
                  </div>
                </div>

                <p className="text-gray-600 mt-3 max-w-xl">{doctorDetail.bio}</p>
              </div>
            </div>

            {/* Action bên phải */}
            <div className="shrink-0">
              <Button
                onClick={() => {
                  dispatch(setDoctor(doctorDetail)); // lưu bác sĩ vào redux
                  router.push("/user/booking/step-2"); // nhảy thẳng Step 2
                }}
                className="
          px-8 py-3 
          bg-gradient-to-r from-emerald-600 to-emerald-500
          hover:from-emerald-700 hover:to-emerald-600
          text-white font-semibold text-lg
          rounded-xl shadow-lg
          transition-all duration-300 ease-in-out
          flex items-center justify-center gap-2
          transform hover:scale-[1.03] active:scale-95
        "
              >
                <Calendar className="w-5 h-5" />
                Đặt lịch khám
              </Button>
            </div>
          </div>
        </div>



        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin liên hệ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Điện thoại</p>
                    <p className="font-medium text-gray-800">{formatPhoneNumber(doctorDetail.phone)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800 truncate" title={doctorDetail.email}>
                      {doctorDetail.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Degrees and Licenses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Học vị & Giấy phép</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Học vị</h3>
                  {degrees.map((degree) => (
                    <div key={degree.id} className="p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{degree.title}</h4>
                          <p className="text-gray-600 text-sm">{degree.field}</p>
                        </div>
                        <Badge className="bg-gray-200 text-gray-700">{degree.graduation_year}</Badge>
                      </div>
                      {degree.certificate_file && (
                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Đã xác minh</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Giấy phép hành nghề</h3>
                  {licenses.map((license) => (
                    <div key={license.id} className="p-4 bg-gray-50 rounded-lg mb-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-800">{license.title}</h4>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-semibold px-3 py-1">
                          Có hiệu lực
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-medium">Cấp ngày:</span> {formatDate(license.issued_date)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <span className="font-medium">Hết hạn:</span> {formatDate(license.expiry_date)}
                      </p>
                      {license.certificate_file && (
                        <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Đã xác minh</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Đánh giá từ bệnh nhân</h2>
              {doctorDetail.ratings.map((rating) => (
                <div key={rating.id} className="p-4 bg-gray-50 rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rating.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="font-medium text-gray-700">{rating.rating}/5</span>
                    </div>
                    <span className="text-gray-500 text-sm">{formatDate(rating.created_at)}</span>
                  </div>
                  <p className="text-gray-600">{rating.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Schedule */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch làm việc</h3>
                {doctorDetail.availabilities.map((availability) => (
                  <div
                    key={availability.id}
                    className="flex justify-between items-center p-3 bg-blue-50 rounded-lg mb-2"
                  >
                    <span className="font-medium text-gray-800">
                      {dayTranslations[availability.day_of_week]}
                    </span>
                    {/* <div className="flex items-center gap-2 text-blue-600 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{shiftToTime[availability.] || "—"}</span>
                    </div> */}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Tổng đánh giá</span>
                    <span className="font-medium text-gray-800">{doctorDetail.ratings.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Điểm trung bình</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-800">{calculateAverageRating(doctorDetail.ratings)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Kinh nghiệm</span>
                    <span className="font-medium text-gray-800">{doctorDetail.experience_years} năm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}