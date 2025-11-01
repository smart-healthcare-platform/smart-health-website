"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import { AppointmentCategory, AppointmentType, PatientFormData } from "@/types";

interface PatientFormProps {
  formData: PatientFormData;
  onFormChange: (data: PatientFormData) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ formData, onFormChange }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { isFollowUp, followUpId } = useSelector((state: RootState) => state.booking)
  useEffect(() => {
    if (user && user.role === "PATIENT") {
      const baseForm: PatientFormData = {
        ...formData,
        fullName: user.profile.fullName || "",
        birthDate: user.profile.dateOfBirth || "",
        gender: user.profile.gender || "",
        address: user.profile.address || "",
        phone: user.phone || "",
        category: isFollowUp ? AppointmentCategory.FOLLOW_UP : AppointmentCategory.NEW,
        type: AppointmentType.OFFLINE,
      }

      if (isFollowUp && followUpId) {
        (baseForm as any).followUpId = followUpId
      }

      onFormChange(baseForm)
    }
  }, [user, isFollowUp, followUpId])


  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-semibold text-gray-900 mb-6">
        Thông tin bệnh nhân
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên *
          </label>
          <input
            type="text"
            value={formData.fullName}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại *
          </label>
          <input
            type="tel"
            value={formData.phone}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày sinh *
          </label>
          <input
            type="date"
            value={formData.birthDate}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới tính *
          </label>
          <input
            type="text"
            value={
              formData.gender === "male"
                ? "Nam"
                : formData.gender === "female"
                  ? "Nữ"
                  : "Khác"
            }
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Địa chỉ */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            value={formData.address}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại khám
          </label>
          <input
            type="text"
            value={isFollowUp ? "Tái khám" : "Khám mới"}
            readOnly
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>


        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú / Triệu chứng
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              onFormChange({ ...formData, notes: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-24"
            placeholder="Nhập triệu chứng, ghi chú hoặc lý do khám bệnh"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
