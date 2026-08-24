import type {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '@features/collections/types/collection.types';

export interface CollectionsApiInterface {
  loadCollections(): Promise<Collection[]>;
  addCollection(collection: CreateCollectionPayload): Promise<Collection>;
  updateCollection(collection: UpdateCollectionPayload): Promise<Collection>;
  deleteCollection(id: string): Promise<string>;
}
