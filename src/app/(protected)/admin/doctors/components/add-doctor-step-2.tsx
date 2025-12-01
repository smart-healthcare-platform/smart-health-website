"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CertificateType } from "@/types/doctor/enums/doctor-certificate.type"
import { DoctorFormInput } from "@/types/doctor/doctor-form-input"
import { CreateDoctorCertificateDto } from "@/types/doctor/dto/create-certificate.dto"
import { Plus, Trash2 } from "lucide-react"

interface Step2Props {
  data: DoctorFormInput
  setData: any
  setStepValid: (valid: boolean) => void
}

export default function Step2Certificates({ data, setData, setStepValid }: Step2Props) {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const addCertificate = (type: CertificateType) => {
    setData({
      ...data,
      certificates: [
        ...data.certificates,
        { type, title: "", field: "", certificate_number: "", issued_by: "", issued_date: "", expiry_date: "", graduation_year: "" }
      ]
    })
  }

  const updateCertificate = (index: number, newCert: Partial<typeof data.certificates[0]>) => {
    const newCerts = [...data.certificates]
    newCerts[index] = { ...newCerts[index], ...newCert }
    setData({ ...data, certificates: newCerts })
  }

  const removeCertificate = (index: number) => {
    const newCerts = [...data.certificates]
    newCerts.splice(index, 1)
    setData({ ...data, certificates: newCerts })
  }

  const handleBlur = (key: string) => setTouched(prev => ({ ...prev, [key]: true }))

  useEffect(() => {
    const newErrors: { [key: string]: string } = {}

    data.certificates.forEach((cert, i) => {
      if (touched[`title_${i}`] && !cert.title) newErrors[`title_${i}`] = "Tiêu đề bắt buộc"

      if (cert.type === CertificateType.DEGREE) {
        if (touched[`field_${i}`] && !cert.field) newErrors[`field_${i}`] = "Lĩnh vực bắt buộc"
        if (touched[`graduation_year_${i}`] && !cert.graduation_year) newErrors[`graduation_year_${i}`] = "Năm tốt nghiệp bắt buộc"
      }

      if (cert.type === CertificateType.LICENSE) {
        if (touched[`certificate_number_${i}`] && !cert.certificate_number) newErrors[`certificate_number_${i}`] = "Số giấy phép bắt buộc"
        if (touched[`issued_by_${i}`] && !cert.issued_by) newErrors[`issued_by_${i}`] = "Nơi cấp bắt buộc"
        if (touched[`issued_date_${i}`] && !cert.issued_date) newErrors[`issued_date_${i}`] = "Ngày cấp bắt buộc"
        if (touched[`expiry_date_${i}`] && !cert.expiry_date) newErrors[`expiry_date_${i}`] = "Ngày hết hạn bắt buộc"
      }
    })

    setErrors(newErrors)
    setStepValid(Object.keys(newErrors).length === 0 && data.certificates.length > 0)
  }, [data, touched, setStepValid])

  return (
    <div className="space-y-6 max-h-[calc(100vh-260px)] overflow-y-auto pr-2">
      <div className="flex gap-3 mb-4">
        <Button type="button" onClick={() => addCertificate(CertificateType.DEGREE)}>Bằng cấp</Button>
        <Button type="button" onClick={() => addCertificate(CertificateType.LICENSE)}>Giấy phép</Button>
      </div>

      {data.certificates.map((cert, i) => (
        <div key={i} className="border rounded p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span>{cert.type === CertificateType.DEGREE ? "Bằng cấp" : "Giấy phép"}</span>
            <Button type="button" onClick={() => removeCertificate(i)}>Xóa</Button>
          </div>

          <Label>Tiêu đề</Label>
          <Input
            value={cert.title}
            onChange={e => updateCertificate(i, { title: e.target.value })}
            onBlur={() => handleBlur(`title_${i}`)}
            className={errors[`title_${i}`] ? "border-red-500" : ""}
          />
          {errors[`title_${i}`] && <p className="text-red-500 text-sm">{errors[`title_${i}`]}</p>}

          {cert.type === CertificateType.DEGREE && (
            <>
              <Label>Lĩnh vực</Label>
              <Input
                value={cert.field}
                onChange={e => updateCertificate(i, { field: e.target.value })}
                onBlur={() => handleBlur(`field_${i}`)}
                className={errors[`field_${i}`] ? "border-red-500" : ""}
              />
              {errors[`field_${i}`] && <p className="text-red-500 text-sm">{errors[`field_${i}`]}</p>}

              <Label>Năm tốt nghiệp</Label>
              <Input
                type="number"
                value={cert.graduation_year ?? ''}
                onChange={e => updateCertificate(i, { graduation_year: e.target.value ? Number(e.target.value) : undefined })}
                onBlur={() => handleBlur(`graduation_year_${i}`)}
                className={errors[`graduation_year_${i}`] ? "border-red-500" : ""}
              />
              {errors[`graduation_year_${i}`] && <p className="text-red-500 text-sm">{errors[`graduation_year_${i}`]}</p>}
            </>
          )}

          {cert.type === CertificateType.LICENSE && (
            <>
              <Label>Số giấy phép</Label>
              <Input
                value={cert.certificate_number}
                onChange={e => updateCertificate(i, { certificate_number: e.target.value })}
                onBlur={() => handleBlur(`certificate_number_${i}`)}
                className={errors[`certificate_number_${i}`] ? "border-red-500" : ""}
              />
              {errors[`certificate_number_${i}`] && <p className="text-red-500 text-sm">{errors[`certificate_number_${i}`]}</p>}

              <Label>Nơi cấp</Label>
              <Input
                value={cert.issued_by}
                onChange={e => updateCertificate(i, { issued_by: e.target.value })}
                onBlur={() => handleBlur(`issued_by_${i}`)}
                className={errors[`issued_by_${i}`] ? "border-red-500" : ""}
              />
              {errors[`issued_by_${i}`] && <p className="text-red-500 text-sm">{errors[`issued_by_${i}`]}</p>}

              <Label>Ngày cấp</Label>
              <Input
                type="date"
                value={cert.issued_date ?? ''}
                onChange={e => updateCertificate(i, { issued_date: e.target.value })}
                onBlur={() => handleBlur(`issued_date_${i}`)}
                className={errors[`issued_date_${i}`] ? "border-red-500" : ""}
              />
              {errors[`issued_date_${i}`] && <p className="text-red-500 text-sm">{errors[`issued_date_${i}`]}</p>}

              <Label>Ngày hết hạn</Label>
              <Input
                type="date"
                value={cert.expiry_date ?? ''}
                onChange={e => updateCertificate(i, { expiry_date: e.target.value })}
                onBlur={() => handleBlur(`expiry_date_${i}`)}
                className={errors[`expiry_date_${i}`] ? "border-red-500" : ""}
              />
              {errors[`expiry_date_${i}`] && <p className="text-red-500 text-sm">{errors[`expiry_date_${i}`]}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
