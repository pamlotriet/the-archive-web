import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../../types/collection.types';

export const CollectionsApiActions = createActionGroup({
  source: 'CollectionsApi',
  events: {
    loadCollections: emptyProps(),
    loadCollectionsSuccess: props<{ collections: Collection[] }>(),
    loadCollectionsFailure: props<{ error: string }>(),
    addCollection: props<{ collection: CreateCollectionPayload }>(),
    addCollectionSuccess: props<{ collection: Collection }>(),
    addCollectionFailure: props<{ error: string }>(),
    updateCollection: props<{ collection: UpdateCollectionPayload }>(),
    updateCollectionSuccess: props<{ collection: Collection }>(),
    updateCollectionFailure: props<{ error: string }>(),
    deleteCollection: props<{ id: string }>(),
    deleteCollectionSuccess: props<{ id: string }>(),
    deleteCollectionFailure: props<{ error: string }>(),
  },
});
