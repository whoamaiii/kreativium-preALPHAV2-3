export interface APIResponse<T> {
  data: T;
  error?: string;
  status: number;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
  path?: string;
  timestamp?: string;
}