import { createFeatureSelector, createSelector } from '@ngrx/store';
import { collectionsApiFeatureKey } from './collectionsApi.reducer';
import type { CollectionsApiState } from './collectionsApi.state';

export const selectCollectionsApiState =
  createFeatureSelector<CollectionsApiState>(collectionsApiFeatureKey);

export const selectCollections = createSelector(
  selectCollectionsApiState,
  (state) => state.collections,
);
export const selectCollectionsLoading = createSelector(
  selectCollectionsApiState,
  (state) => state.loading,
);
export const selectCollectionsSaving = createSelector(
  selectCollectionsApiState,
  (state) => state.saving,
);
export const selectCollectionsDeleting = createSelector(
  selectCollectionsApiState,
  (state) => state.deleting,
);
export const selectCollectionsError = createSelector(
  selectCollectionsApiState,
  (state) => state.error,
);
