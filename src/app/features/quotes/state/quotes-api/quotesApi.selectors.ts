import { createFeatureSelector, createSelector } from '@ngrx/store';
import { quotesApiFeatureKey } from './quotesApi.reducer';
import type { QuotesApiState } from './quotesApi.state';

export const selectQuotesApiState = createFeatureSelector<QuotesApiState>(quotesApiFeatureKey);

export const selectQuotes = createSelector(selectQuotesApiState, (state) => state.quotes);
export const selectQuotesLoading = createSelector(selectQuotesApiState, (state) => state.loading);
export const selectQuotesSaving = createSelector(selectQuotesApiState, (state) => state.saving);
export const selectQuotesDeleting = createSelector(selectQuotesApiState, (state) => state.deleting);
export const selectQuotesError = createSelector(selectQuotesApiState, (state) => state.error);
