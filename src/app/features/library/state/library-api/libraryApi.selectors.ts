import { createFeatureSelector, createSelector } from '@ngrx/store';
import { libraryApiFeatureKey, LibraryApiState } from '@features/library/state/library-api';

export const selectLibraryApiState = createFeatureSelector<LibraryApiState>(libraryApiFeatureKey);

export const selectLibraryItems = createSelector(
  selectLibraryApiState,
  (state) => state.items ?? [],
);
export const selectLibraryLoading = createSelector(selectLibraryApiState, (state) => state.loading);
export const selectLibrarySaving = createSelector(selectLibraryApiState, (state) => state.saving);
export const selectLibraryDeleting = createSelector(
  selectLibraryApiState,
  (state) => state.deleting,
);
export const selectLibraryError = createSelector(selectLibraryApiState, (state) => state.error);
export const selectLibrarySearchTerm = createSelector(
  selectLibraryApiState,
  (state) => state.searchTerm,
);
export const selectLibraryCategoryFilter = createSelector(
  selectLibraryApiState,
  (state) => state.categoryFilter,
);
export const selectLibraryStatusFilter = createSelector(
  selectLibraryApiState,
  (state) => state.statusFilter,
);
export const selectLibraryPage = createSelector(selectLibraryApiState, (state) => state.page);
export const selectLibraryPageSize = createSelector(
  selectLibraryApiState,
  (state) => state.pageSize,
);

export const selectFilteredLibraryItems = createSelector(selectLibraryApiState, (state) => {
  const searchTerm = state.searchTerm.trim().toLowerCase();

  return (state.items ?? []).filter((item) => {
    const matchesCategory =
      state.categoryFilter === 'all' || item.category === state.categoryFilter;
    const matchesStatus =
      state.statusFilter === 'all' || statusMatchesFilter(item.status, state.statusFilter);
    const searchableText = [
      item.title,
      item.description,
      item.author,
      item.producer,
      item.sourceUrl,
      item.note,
      ...(item.tags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

    return matchesCategory && matchesStatus && matchesSearch;
  });
});

function statusMatchesFilter(
  status: string,
  filter: 'wantToStart' | 'inProgress' | 'completed',
): boolean {
  const statuses = {
    wantToStart: ['wantToWatch', 'wantToRead', 'wantToPlay', 'wantToListen'],
    inProgress: ['watching', 'reading', 'playing', 'listening'],
    completed: ['watched', 'read', 'played', 'listened'],
  } satisfies Record<'wantToStart' | 'inProgress' | 'completed', string[]>;

  return statuses[filter].includes(status);
}

export const selectLibraryTotalItems = createSelector(
  selectFilteredLibraryItems,
  (items) => items.length,
);

export const selectLibraryTotalPages = createSelector(
  selectLibraryTotalItems,
  selectLibraryPageSize,
  (totalItems, pageSize) => Math.max(Math.ceil(totalItems / pageSize), 1),
);

export const selectLibraryVisiblePage = createSelector(
  selectLibraryPage,
  selectLibraryTotalPages,
  (page, totalPages) => Math.min(Math.max(page, 1), totalPages),
);

export const selectPagedLibraryItems = createSelector(
  selectFilteredLibraryItems,
  selectLibraryVisiblePage,
  selectLibraryPageSize,
  (items, page, pageSize) => items.slice((page - 1) * pageSize, page * pageSize),
);
