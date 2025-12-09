export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
  code: number
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}