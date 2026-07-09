import type { category, Item } from '../../types/item.types';

export type LibraryCategoryFilter = category | 'all';
export type LibraryStatusFilter = 'all' | 'wantToStart' | 'inProgress' | 'completed';

export interface LibraryApiState {
  items: Item[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  searchTerm: string;
  categoryFilter: LibraryCategoryFilter;
  statusFilter: LibraryStatusFilter;
  page: number;
  pageSize: number;
}

export const initialState: LibraryApiState = {
  items: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  searchTerm: '',
  categoryFilter: 'all',
  statusFilter: 'all',
  page: 1,
  pageSize: 8,
};
