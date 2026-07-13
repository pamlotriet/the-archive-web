import { createFeatureSelector, createSelector } from '@ngrx/store';
import { readingLogApiFeatureKey } from './readingLogApi.reducer';
import type { ReadingLogApiState } from './readingLogApi.state';

export const selectReadingLogApiState =
  createFeatureSelector<ReadingLogApiState>(readingLogApiFeatureKey);

export const selectReadingLogs = createSelector(selectReadingLogApiState, (state) => state.logs);
export const selectReadingLogLoading = createSelector(
  selectReadingLogApiState,
  (state) => state.loading,
);
export const selectReadingLogSaving = createSelector(
  selectReadingLogApiState,
  (state) => state.saving,
);
export const selectReadingLogDeleting = createSelector(
  selectReadingLogApiState,
  (state) => state.deleting,
);
export const selectReadingLogError = createSelector(
  selectReadingLogApiState,
  (state) => state.error,
);
