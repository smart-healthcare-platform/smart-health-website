"use client"
import { DoctorFormInput } from "@/types/doctor/doctor-form-input"

interface Step4Props {
  data: DoctorFormInput
}

export default function Step4Review({ data }: Step4Props) {
  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {/* Thông tin cơ bản */}
      <div className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-2">
        <h4 className="font-semibold text-lg">Thông tin cơ bản</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Họ và tên</p>
            <p className="text-gray-800 font-medium">{data.full_name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-gray-800 font-medium">{data.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Giới tính</p>
            <p className="text-gray-800 font-medium">{data.gender}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Ngày sinh</p>
            <p className="text-gray-800 font-medium">{data.date_of_birth}</p>
          </div>
          {data.phone && (
            <div>
              <p className="text-gray-500 text-sm">Số điện thoại</p>
              <p className="text-gray-800 font-medium">{data.phone}</p>
            </div>
          )}
          {data.bio && (
            <div className="col-span-2">
              <p className="text-gray-500 text-sm">Tiểu sử</p>
              <p className="text-gray-800 font-medium">{data.bio}</p>
            </div>
          )}
        </div>
      </div>

      {data.certificates.length > 0 && (
        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-2">
          <h4 className="font-semibold text-lg">Bằng cấp & Chứng chỉ</h4>
          <div className="space-y-3">
            {data.certificates.map((cert, i) => (
              <div key={i} className="border rounded p-3 bg-white shadow-sm space-y-1">
                <p className="text-gray-500 text-sm">Loại</p>
                <p className="text-gray-800 font-medium">{cert.type === "DEGREE" ? "Bằng cấp" : "Giấy phép"}</p>

                <p className="text-gray-500 text-sm mt-1">Tiêu đề</p>
                <p className="text-gray-800 font-medium">{cert.title}</p>

                {cert.type === "DEGREE" && (
                  <>
                    {cert.field && (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Ngành</p>
                        <p className="text-gray-800 font-medium">{cert.field}</p>
                      </>
                    )}
                    {cert.graduation_year && (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Năm tốt nghiệp</p>
                        <p className="text-gray-800 font-medium">{cert.graduation_year}</p>
                      </>
                    )}
                  </>
                )}

                {cert.type === "LICENSE" && (
                  <>
                    {cert.certificate_number && (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Số giấy phép</p>
                        <p className="text-gray-800 font-medium">{cert.certificate_number}</p>
                      </>
                    )}
                    {cert.issued_by && (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Cơ quan cấp</p>
                        <p className="text-gray-800 font-medium">{cert.issued_by}</p>
                      </>
                    )}
                    {cert.issued_date && (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Ngày cấp</p>
                        <p className="text-gray-800 font-medium">{cert.issued_date}</p>
                      </>
                    )}
                    {cert.expiry_date && (
                      <>
                        <p className="text-gray-500 text-sm mt-1">Ngày hết hạn</p>
                        <p className="text-gray-800 font-medium">{cert.expiry_date}</p>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}


      {data.weeklyAvailability.length > 0 && (
        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-2">
          <h4 className="font-semibold text-lg">Lịch làm việc</h4>
          <div className="grid grid-cols-2 gap-4">
            {data.weeklyAvailability.map((d, i) => (
              <div key={i}>
                <p className="text-gray-500 text-sm">{d.day_of_week}</p>
                <p className="text-gray-800 font-medium">{d.start_time} - {d.end_time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
