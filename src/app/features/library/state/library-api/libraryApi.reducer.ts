import { createReducer, on } from '@ngrx/store';
import { LibraryApiActions } from './libraryApi.actions';
import { initialState } from './libraryApi.state';

export const libraryApiFeatureKey = 'libraryApi';

export const libraryApiReducer = createReducer(
  initialState,
  on(LibraryApiActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(LibraryApiActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    items,
  })),
  on(LibraryApiActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(LibraryApiActions.addItem, LibraryApiActions.updateItem, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(LibraryApiActions.addItemSuccess, (state, { item }) => ({
    ...state,
    saving: false,
    items: [item, ...state.items],
  })),
  on(LibraryApiActions.updateItemSuccess, (state, { item }) => ({
    ...state,
    saving: false,
    items: state.items.map((existingItem) => (existingItem.id === item.id ? item : existingItem)),
  })),
  on(LibraryApiActions.addItemFailure, LibraryApiActions.updateItemFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),
  on(LibraryApiActions.deleteItem, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(LibraryApiActions.deleteItemSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    items: state.items.filter((item) => item.id !== id),
  })),
  on(LibraryApiActions.deleteItemFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),
  on(LibraryApiActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
    page: 1,
  })),
  on(LibraryApiActions.setCategoryFilter, (state, { category }) => ({
    ...state,
    categoryFilter: category,
    page: 1,
  })),
  on(LibraryApiActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status,
    page: 1,
  })),
  on(LibraryApiActions.setPage, (state, { page }) => ({
    ...state,
    page: Math.max(page, 1),
  })),
  on(LibraryApiActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize: Math.max(pageSize, 1),
    page: 1,
  })),
);
