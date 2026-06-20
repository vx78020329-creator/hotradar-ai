export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface SearchParams {
  q: string;
  category?: string;
  status?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  hotEventsCount: number;
  dataSourcesCount: number;
  companiesCount: number;
  reportsCount: number;
  weeklyGrowth: number;
  activeUsers: number;
}
