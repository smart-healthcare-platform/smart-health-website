export function formatCurrencyVND(value: number | string): string {
  if (value === null || value === undefined || value === "") return "0 ₫"

  const numberValue = typeof value === "string" ? parseFloat(value) : value

  if (isNaN(numberValue)) return "0 ₫"

  return numberValue.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) + " ₫"
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)

  const datePart = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  })

  const timePart = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  })

  return `${datePart} ${timePart}`
}

