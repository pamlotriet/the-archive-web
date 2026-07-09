import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { CreateItemPayload, UpdateItemPayload } from '../../types/item.types';
import { LibraryApiActions } from './libraryApi.actions';
import {
  selectLibraryCategoryFilter,
  selectLibraryDeleting,
  selectLibraryError,
  selectLibraryLoading,
  selectLibraryPageSize,
  selectLibrarySaving,
  selectLibrarySearchTerm,
  selectLibraryStatusFilter,
  selectLibraryTotalItems,
  selectLibraryTotalPages,
  selectLibraryVisiblePage,
  selectPagedLibraryItems,
} from './libraryApi.selectors';
import type { LibraryCategoryFilter, LibraryStatusFilter } from './libraryApi.state';

@Injectable({
  providedIn: 'root',
})
export class LibraryApiFacade {
  private readonly store = inject(Store);

  readonly items = this.store.selectSignal(selectPagedLibraryItems);
  readonly totalItems = this.store.selectSignal(selectLibraryTotalItems);
  readonly totalPages = this.store.selectSignal(selectLibraryTotalPages);
  readonly page = this.store.selectSignal(selectLibraryVisiblePage);
  readonly pageSize = this.store.selectSignal(selectLibraryPageSize);
  readonly searchTerm = this.store.selectSignal(selectLibrarySearchTerm);
  readonly categoryFilter = this.store.selectSignal(selectLibraryCategoryFilter);
  readonly statusFilter = this.store.selectSignal(selectLibraryStatusFilter);
  readonly loading = this.store.selectSignal(selectLibraryLoading);
  readonly saving = this.store.selectSignal(selectLibrarySaving);
  readonly deleting = this.store.selectSignal(selectLibraryDeleting);
  readonly error = this.store.selectSignal(selectLibraryError);

  loadItems(): void {
    this.store.dispatch(LibraryApiActions.loadItems());
  }

  addItem(item: CreateItemPayload): void {
    this.store.dispatch(LibraryApiActions.addItem({ item }));
  }

  updateItem(item: UpdateItemPayload): void {
    this.store.dispatch(LibraryApiActions.updateItem({ item }));
  }

  deleteItem(id: string): void {
    this.store.dispatch(LibraryApiActions.deleteItem({ id }));
  }

  setSearchTerm(searchTerm: string): void {
    this.store.dispatch(LibraryApiActions.setSearchTerm({ searchTerm }));
  }

  setCategoryFilter(category: LibraryCategoryFilter): void {
    this.store.dispatch(LibraryApiActions.setCategoryFilter({ category }));
  }

  setStatusFilter(status: LibraryStatusFilter): void {
    this.store.dispatch(LibraryApiActions.setStatusFilter({ status }));
  }

  setPage(page: number): void {
    this.store.dispatch(LibraryApiActions.setPage({ page }));
  }

  setPageSize(pageSize: number): void {
    this.store.dispatch(LibraryApiActions.setPageSize({ pageSize }));
  }
}
