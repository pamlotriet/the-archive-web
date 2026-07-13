import { createReducer, on } from '@ngrx/store';
import { CollectionsApiActions } from './collectionsApi.actions';
import { initialState } from './collectionsApi.state';

export const collectionsApiFeatureKey = 'collectionsApi';

export const collectionsApiReducer = createReducer(
  initialState,
  on(CollectionsApiActions.loadCollections, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionsApiActions.loadCollectionsSuccess, (state, { collections }) => ({
    ...state,
    loading: false,
    collections,
  })),
  on(CollectionsApiActions.loadCollectionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(CollectionsApiActions.addCollection, CollectionsApiActions.updateCollection, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(CollectionsApiActions.addCollectionSuccess, (state, { collection }) => ({
    ...state,
    saving: false,
    collections: [collection, ...state.collections],
  })),
  on(CollectionsApiActions.updateCollectionSuccess, (state, { collection }) => ({
    ...state,
    saving: false,
    collections: state.collections.map((existingCollection) =>
      existingCollection.id === collection.id ? collection : existingCollection,
    ),
  })),
  on(
    CollectionsApiActions.addCollectionFailure,
    CollectionsApiActions.updateCollectionFailure,
    (state, { error }) => ({
      ...state,
      saving: false,
      error,
    }),
  ),
  on(CollectionsApiActions.deleteCollection, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(CollectionsApiActions.deleteCollectionSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    collections: state.collections.filter((collection) => collection.id !== id),
  })),
  on(CollectionsApiActions.deleteCollectionFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),
);
