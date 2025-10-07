import { Heart, Activity } from "lucide-react"

export function DiagnosisHeader() {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Chuẩn đoán thông minh bệnh tim mạch</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Nhập các chỉ số sức khỏe của bạn để nhận được đánh giá AI về nguy cơ bệnh tim mạch. Hệ thống sử dụng trí tuệ
            nhân tạo để phân tích và đưa ra khuyến nghị chuyên môn.
          </p>
        </div>
      </div>
    </div>
  )
}
