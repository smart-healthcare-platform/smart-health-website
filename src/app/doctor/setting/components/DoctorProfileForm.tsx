// 📁 src/app/doctor/settings/components/DoctorProfileForm.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function DoctorProfileForm() {
  const [form, setForm] = useState({
    name: 'Nguyễn Văn A',
    email: 'bacsi.a@gmail.com',
    phone: '0901234567',
    specialty: 'Nội tổng quát',
    experience: '8 năm',
    bio: 'Tốt nghiệp Đại học Y Hà Nội, đã công tác tại Bệnh viện Bạch Mai trong 5 năm...',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dữ liệu gửi:', form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">Họ và tên</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} className="mt-2 w-full" />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="mt-2 w-full" />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Số điện thoại</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="mt-2 w-full" />
        </div>
        <div>
          <Label htmlFor="specialty" className="text-sm font-medium text-gray-700">Chuyên khoa</Label>
          <Input id="specialty" name="specialty" value={form.specialty} onChange={handleChange} className="mt-2 w-full" />
        </div>
        <div>
          <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Kinh nghiệm</Label>
          <Input id="experience" name="experience" value={form.experience} onChange={handleChange} className="mt-2 w-full" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Giới thiệu</Label>
          <Textarea id="bio" name="bio" rows={5} value={form.bio} onChange={handleChange} className="mt-2 w-full" />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button type="button" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg">
          Đổi mật khẩu
        </Button>
        <div className="flex space-x-6">
          <Button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </form>
  )
}