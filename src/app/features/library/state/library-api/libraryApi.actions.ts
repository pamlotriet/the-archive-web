import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../../types/item.types';
import type { LibraryCategoryFilter, LibraryStatusFilter } from './libraryApi.state';

export const LibraryApiActions = createActionGroup({
  source: 'LibraryApi',
  events: {
    loadItems: emptyProps(),
    loadItemsSuccess: props<{ items: Item[] }>(),
    loadItemsFailure: props<{ error: string }>(),
    addItem: props<{ item: CreateItemPayload }>(),
    addItemSuccess: props<{ item: Item }>(),
    addItemFailure: props<{ error: string }>(),
    updateItem: props<{ item: UpdateItemPayload }>(),
    updateItemSuccess: props<{ item: Item }>(),
    updateItemFailure: props<{ error: string }>(),
    deleteItem: props<{ id: string }>(),
    deleteItemSuccess: props<{ id: string }>(),
    deleteItemFailure: props<{ error: string }>(),
    setSearchTerm: props<{ searchTerm: string }>(),
    setCategoryFilter: props<{ category: LibraryCategoryFilter }>(),
    setStatusFilter: props<{ status: LibraryStatusFilter }>(),
    setPage: props<{ page: number }>(),
    setPageSize: props<{ pageSize: number }>(),
  },
});
