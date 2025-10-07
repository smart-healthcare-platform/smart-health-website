"use client";
import Link from "next/link";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 rounded-full p-4">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn không có quyền truy cập trang này.
          </p>
          
          {/* Buttons */}
          <div className="space-y-3">
            <Link 
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}