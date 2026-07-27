export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPaginationParams = (page?: number, limit?: number): PaginationParams => {
  const p = Math.max(1, page || 1);
  const l = Math.min(Math.max(1, limit || 20), 100);
  return { page: p, limit: l, skip: (p - 1) * l };
};

export const getPaginationMeta = (total: number, params: PaginationParams): PaginationMeta => ({
  page: params.page,
  limit: params.limit,
  total,
  totalPages: Math.ceil(total / params.limit) || 1,
});