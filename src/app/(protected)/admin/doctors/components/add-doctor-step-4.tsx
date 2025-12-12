"use client"
import { DoctorFormInput } from "@/types/doctor/doctor-form-input"
import { CertificateType } from "@/types/doctor/enums/doctor-certificate.type"

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
          <Info label="Họ và tên" value={data.full_name} />
          <Info label="Email" value={data.email} />
          <Info label="Giới tính" value={data.gender} />
          <Info label="Ngày sinh" value={data.date_of_birth} />
          {data.phone && <Info label="Số điện thoại" value={data.phone} />}
          {data.bio && <Info label="Tiểu sử" value={data.bio} className="col-span-2" />}
        </div>
      </div>

      {/* Bằng cấp - Chứng chỉ */}
      {data.certificates.length > 0 && (
        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-3">
          <h4 className="font-semibold text-lg">Bằng cấp & Chứng chỉ</h4>

          {data.certificates.map((cert, i) => (
            <div key={i} className="border rounded p-3 bg-white shadow-sm space-y-2">

              <Info label="Loại" value={cert.type === CertificateType.DEGREE ? "Bằng cấp" : "Giấy phép"} />

              {/* Common */}
              {cert.description && (
                <Info label="Mô tả" value={cert.description} />
              )}

              {cert.type === CertificateType.DEGREE && (
                <>
                  {cert.academic_degree && (
                    <Info label="Học vị" value={cert.academic_degree} />
                  )}

                  {cert.field && (
                    <Info label="Ngành" value={cert.field} />
                  )}

                  {cert.graduation_year && (
                    <Info label="Năm tốt nghiệp" value={cert.graduation_year} />
                  )}
                </>
              )}

              {cert.type === CertificateType.LICENSE && (
                <>
                  {cert.license_number && (
                    <Info label="Số giấy phép" value={cert.license_number} />
                  )}

                  {cert.issued_by && (
                    <Info label="Cơ quan cấp" value={cert.issued_by} />
                  )}

                  {cert.issued_date && (
                    <Info label="Ngày cấp" value={cert.issued_date} />
                  )}

                  {cert.expiry_date && (
                    <Info label="Ngày hết hạn" value={cert.expiry_date} />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lịch làm việc */}
      {data.weeklyAvailability.length > 0 && (
        <div className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-2">
          <h4 className="font-semibold text-lg">Lịch làm việc</h4>
          <div className="grid grid-cols-2 gap-4">
            {data.weeklyAvailability.map((d, i) => (
              <Info
                key={i}
                label={d.day_of_week}
                value={`${d.start_time} - ${d.end_time}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* Component nhỏ dùng chung */
function Info({ label, value, className = "" }: any) {
  return (
    <div className={className}>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  )
}
