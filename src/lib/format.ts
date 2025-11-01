export function formatCurrencyVND(value: number | string): string {
    if (value === null || value === undefined || value === "") return "0 ₫"
  
    const numberValue = typeof value === "string" ? parseFloat(value) : value
  
    if (isNaN(numberValue)) return "0 ₫"
  
    return numberValue.toLocaleString("vi-VN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " ₫"
  }
  