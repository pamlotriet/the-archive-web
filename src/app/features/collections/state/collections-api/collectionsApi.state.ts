import type { Collection } from '../../types/collection.types';

export interface CollectionsApiState {
  collections: Collection[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialState: CollectionsApiState = {
  collections: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};
