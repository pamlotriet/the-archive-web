import type {
  CreateItemPayload,
  Item,
  UpdateItemPayload,
} from '@features/library/types/item.types';

export interface LibraryApiInterface {
  loadItems(): Promise<Item[]>;
  addItem(item: CreateItemPayload): Promise<Item>;
  updateItem(item: UpdateItemPayload): Promise<Item>;
  deleteItem(id: string): Promise<string>;
}
