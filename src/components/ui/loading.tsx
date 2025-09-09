// components/Loading.tsx
"use client";

interface LoadingProps {
  fullScreen?: boolean; // true nếu muốn che full màn hình
}

export default function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-white/80 z-50" : "relative"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-emerald-600 border-b-emerald-400 border-l-emerald-300 border-r-emerald-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
