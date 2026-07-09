import { createReducer, on } from '@ngrx/store';
import { TagsApiActions } from './tagsApi.actions';
import { initialState } from './tagsApi.state';

export const tagsApiFeatureKey = 'tagsApi';

export const tagsApiReducer = createReducer(
  initialState,
  on(TagsApiActions.loadTags, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TagsApiActions.loadTagsSuccess, (state, { tags }) => ({
    ...state,
    loading: false,
    tags,
  })),
  on(TagsApiActions.loadTagsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TagsApiActions.addTag, TagsApiActions.updateTag, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(TagsApiActions.addTagSuccess, (state, { tag }) => ({
    ...state,
    saving: false,
    tags: [tag, ...state.tags],
  })),
  on(TagsApiActions.updateTagSuccess, (state, { tag }) => ({
    ...state,
    saving: false,
    tags: state.tags.map((existingTag) => (existingTag.id === tag.id ? tag : existingTag)),
  })),
  on(TagsApiActions.addTagFailure, TagsApiActions.updateTagFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),
  on(TagsApiActions.deleteTag, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(TagsApiActions.deleteTagSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    tags: state.tags.filter((tag) => tag.id !== id),
  })),
  on(TagsApiActions.deleteTagFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),
  on(TagsApiActions.incrementTagCountSuccess, (state, { id }) => ({
    ...state,
    tags: state.tags.map((tag) => (tag.id === id ? { ...tag, count: tag.count + 1 } : tag)),
  })),
  on(TagsApiActions.incrementTagCountFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
