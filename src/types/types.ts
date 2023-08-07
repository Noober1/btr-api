import { PaginationResult } from 'prisma-paginate';

// export type ReturnPaginate<T = object> = (
//   page: number,
//   limit: number,
// ) => Promise<PaginationResult<Partial<T>[]>>;

export interface Paginate<T = object> {
  (page: number, limit: number): Promise<PaginationResult<Partial<T>[]>>;
}

export interface ServiceCreateData<T = object> {
  (data: T): Promise<void>;
}
