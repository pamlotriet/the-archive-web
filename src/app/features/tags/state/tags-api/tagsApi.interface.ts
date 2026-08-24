import type { CreateTagPayload, Tag, UpdateTagPayload } from '@features/tags/types/tag.types';

export interface TagsApiInterface {
  loadTags(): Promise<Tag[]>;
  addTag(tag: CreateTagPayload): Promise<Tag>;
  updateTag(tag: UpdateTagPayload): Promise<Tag>;
  deleteTag(id: string): Promise<string>;
  incrementTagCount(id: string): Promise<string>;
}
