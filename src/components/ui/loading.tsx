// components/ui/Loading.tsx
"use client"

interface LoadingProps {
  fullScreen?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Loading({ fullScreen = false, size = "md" }: LoadingProps) {
  const sizeMap = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
  }

  const spinnerClass = `${sizeMap[size]} border-t-emerald-600 border-b-emerald-400 border-l-emerald-300 border-r-emerald-500 rounded-full animate-spin`

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
        <div className={spinnerClass}></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className={spinnerClass}></div>
    </div>
  )
}
