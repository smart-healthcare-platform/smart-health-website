"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Camera, Edit3 } from "lucide-react"
import { DoctorFormInput } from "@/types/doctor/doctor-form-input"
import { Gender } from "@/types/patient/enums/patient-gender.enum.dto"

interface Step1Props {
    data: DoctorFormInput
    setData: (data: DoctorFormInput) => void
    setStepValid: (valid: boolean) => void
}

export default function Step1BasicInfo({ data, setData, setStepValid }: Step1Props) {
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({})
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Validate fields
    useEffect(() => {
        const newErrors: { [key: string]: string } = {}

        // Full name
        if (touched.full_name && !data.full_name) newErrors.full_name = "Họ và tên bắt buộc"

        // Email
        if (touched.email) {
            if (!data.email) newErrors.email = "Email bắt buộc"
            else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = "Email không hợp lệ"
        }

        // Phone
        if (touched.phone) {
            if (!data.phone) newErrors.phone = "Số điện thoại bắt buộc"
            else if (!/^\d{10}$/.test(data.phone)) newErrors.phone = "Số điện thoại phải 10 chữ số"
        }

        // Date of birth
        if (touched.date_of_birth && !data.date_of_birth) newErrors.date_of_birth = "Ngày sinh bắt buộc"
        if (touched.date_of_birth && data.date_of_birth) {
            const birth = new Date(data.date_of_birth)
            const age = new Date().getFullYear() - birth.getFullYear()
            if (age < 24) newErrors.date_of_birth = "Tuổi phải lớn hơn 24"
        }

        setErrors(newErrors)
        setStepValid(Object.keys(newErrors).length === 0)
    }, [data, touched, setStepValid])

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }))

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Avatar */}
            <div className="col-span-2 flex flex-col items-center space-y-4 py-4">
                <label className="relative group cursor-pointer block">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.03]">
                        {data.avatar ? (
                            <img src={data.avatar} className="h-full w-full object-cover" alt="Avatar" />
                        ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <Camera className="w-8 h-8 opacity-70" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Edit3 className="w-7 h-7 text-white" />
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) setData({ ...data, avatar: URL.createObjectURL(file) })
                        }}
                    />
                </label>
            </div>

            {/* Full name */}
            <div className="space-y-1">
                <Label>Họ và tên</Label>
                <Input
                    value={data.full_name}
                    onChange={e => setData({ ...data, full_name: e.target.value })}
                    onBlur={() => handleBlur("full_name")}
                    className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <Label>Email</Label>
                <Input
                    type="email"
                    value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
                    onBlur={() => handleBlur("email")}
                    className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1">
                <Label>Giới tính</Label>
                <Select
                    value={data.gender}
                    onValueChange={(val: Gender) => setData({ ...data, gender: val })}
                >
                    <SelectTrigger><SelectValue placeholder="Chọn giới tính" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={Gender.MALE}>Nam</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Date of birth */}
            <div className="space-y-1">
                <Label>Ngày sinh</Label>
                <Input
                    type="date"
                    value={data.date_of_birth}
                    onChange={e => setData({ ...data, date_of_birth: e.target.value })}
                    onBlur={() => handleBlur("date_of_birth")}
                    className={errors.date_of_birth ? "border-red-500" : ""}
                />
                {errors.date_of_birth && <p className="text-red-500 text-sm">{errors.date_of_birth}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
                <Label>Số điện thoại</Label>
                <Input
                    value={data.phone ?? ""}
                    onChange={e => setData({ ...data, phone: e.target.value })}
                    onBlur={() => handleBlur("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Experience years */}
            <div className="space-y-1">
                <Label>Số năm kinh nghiệm:</Label>
                <Input
                    type="number"
                    value={data.experience_years}
                    onChange={e => setData({ ...data, experience_years: Number(e.target.value) })}
                />
            </div>

            {/* Bio */}
            <div className="col-span-2 space-y-1">
                <Label>Tiểu sử / Bio</Label>
                <Input
                    value={data.bio}
                    onChange={e => setData({ ...data, bio: e.target.value })}
                />
            </div>
        </div>
    )
}
