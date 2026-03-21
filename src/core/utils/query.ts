import { Op, WhereOptions } from 'sequelize';

const RESERVED_KEYS = new Set(['page', 'limit', 'sort', 'order']);

type SortOrder = 'asc' | 'desc';

interface ListQueryOptions {
  defaultSort?: string;
  defaultOrder?: SortOrder;
  allowedSort?: string[];
  allowedFilters?: string[];
}

export const buildListQuery = (
  query: Record<string, unknown>,
  options: ListQueryOptions = {}
) => {
  const page = Math.max(parseInt(String(query.page ?? '1'), 10) || 1, 1);
  const limit = Math.max(parseInt(String(query.limit ?? '20'), 10) || 20, 1);
  const offset = (page - 1) * limit;

  const requestedSort = String(query.sort ?? options.defaultSort ?? 'createdAt');
  const sort = options.allowedSort?.includes(requestedSort) ? requestedSort : options.defaultSort ?? 'createdAt';

  const requestedOrder = String(query.order ?? options.defaultOrder ?? 'desc').toLowerCase();
  const order = (requestedOrder === 'asc' ? 'asc' : 'desc') as SortOrder;

  const filters: WhereOptions = {};
  const allowedFilters = options.allowedFilters ?? [];

  Object.entries(query).forEach(([key, value]) => {
    if (RESERVED_KEYS.has(key)) {
      return;
    }
    if (allowedFilters.length > 0 && !allowedFilters.includes(key)) {
      return;
    }
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      filters[key] = { [Op.in]: value } as unknown as string;
      return;
    }
    filters[key] = value as string;
  });

  return {
    page,
    limit,
    offset,
    sort,
    order,
    where: filters,
    orderBy: [[sort, order]] as Array<[string, SortOrder]>,
  };
};

export const buildMeta = (params: { page: number; limit: number; total: number; sort: string; order: SortOrder }) => {
  const totalPages = Math.max(Math.ceil(params.total / params.limit), 1);
  return {
    page: params.page,
    limit: params.limit,
    total: params.total,
    totalPages,
    sort: params.sort,
    order: params.order,
  };
};
