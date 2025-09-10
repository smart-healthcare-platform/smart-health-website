import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { Doctor} from '@/types/doctor'
import DoctorCard from '../doctor/DoctorCard';

interface BookingSidebarProps {
  selectedDoctor: Doctor | null;
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
  onConfirm: () => void;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({
  selectedDoctor,
  currentStep,
  canProceed,
  onNext,
  onBack,
  onConfirm
}) => {
  return (
    <div className="space-y-6">
      {/* Selected Doctor Preview */}
      {selectedDoctor && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bác sĩ đã chọn</h3>
          <DoctorCard
            doctor={selectedDoctor}
            isSelected={true}
            onSelect={() => {}}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-xl border p-6">
        <div className="space-y-4">
          {currentStep < 4 ? (
            <>
              <button
                onClick={onNext}
                disabled={!canProceed}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  canProceed
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentStep === 3 ? 'Xem lại thông tin' : 'Tiếp tục'}
              </button>
              {currentStep > 1 && (
                <button
                  onClick={onBack}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Quay lại
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onConfirm}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
              >
                Xác nhận đặt lịch
              </button>
              <button
                onClick={onBack}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sửa thông tin
              </button>
            </>
          )}
        </div>
      </div>

      {/* Support Info */}
      <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
        <h4 className="font-semibold text-emerald-900 mb-3">Cần hỗ trợ?</h4>
        <div className="space-y-2 text-sm text-emerald-700">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Hotline: 1900 1234</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>support@healthsmart.vn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSidebar;