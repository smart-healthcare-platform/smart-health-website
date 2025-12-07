"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  page: number
  limit: number
  total: number
  setPage: (page: number) => void
}

export default function PaginationTable({ page, limit, total, setPage }: PaginationProps) {

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        <div>Trang {page} / {totalPages}</div>
        <div>Tổng số lượng: {total}</div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline" size="sm"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </Button>

        <span className="text-sm">{page}</span>

        <Button
          variant="outline" size="sm"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </Button>
      </div>
    </div>
  )
}
