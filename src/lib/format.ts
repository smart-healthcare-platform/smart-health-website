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

export function formatVNDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

export const calculateAge = (dob: string | Date) => {
  const birthDate = new Date(dob)
  const diff = Date.now() - birthDate.getTime()
  const age = new Date(diff).getUTCFullYear() - 1970
  return age
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

