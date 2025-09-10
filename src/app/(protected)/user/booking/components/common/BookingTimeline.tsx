import React from 'react';
import { User, Calendar, FileText, Check } from 'lucide-react';

interface BookingTimelineProps {
  currentStep: number;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, title: "Chọn bác sĩ", icon: User },
    { id: 2, title: "Chọn ngày giờ", icon: Calendar },
    { id: 3, title: "Thông tin bệnh nhân", icon: FileText },
    { id: 4, title: "Xác nhận", icon: Check }
  ];

  return (
    <div className="bg-white rounded-xl border p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : isActive 
                    ? 'border-emerald-500 text-emerald-500 bg-emerald-50' 
                    : 'border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-emerald-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    Bước {step.id}
                  </p>
                  <p className={`text-sm ${
                    isActive ? 'text-gray-900 font-medium' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default BookingTimeline;