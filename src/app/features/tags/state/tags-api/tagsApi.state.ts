import type { Tag } from '../../types/tag.types';

export interface TagsApiState {
  tags: Tag[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialState: TagsApiState = {
  tags: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};
