import { createFeatureSelector, createSelector } from '@ngrx/store';
import { tagsApiFeatureKey } from './tagsApi.reducer';
import type { TagsApiState } from './tagsApi.state';

export const selectTagsApiState = createFeatureSelector<TagsApiState>(tagsApiFeatureKey);

export const selectTags = createSelector(selectTagsApiState, (state) => state.tags);
export const selectTagsLoading = createSelector(selectTagsApiState, (state) => state.loading);
export const selectTagsSaving = createSelector(selectTagsApiState, (state) => state.saving);
export const selectTagsDeleting = createSelector(selectTagsApiState, (state) => state.deleting);
export const selectTagsError = createSelector(selectTagsApiState, (state) => state.error);
