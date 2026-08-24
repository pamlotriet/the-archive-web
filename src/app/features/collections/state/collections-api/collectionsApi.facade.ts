import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type {
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '@features/collections/types/collection.types';
import {
  CollectionsApiActions,
  selectCollections,
  selectCollectionsDeleting,
  selectCollectionsError,
  selectCollectionsLoading,
  selectCollectionsSaving,
} from '@features/collections/state/collections-api';

@Injectable({
  providedIn: 'root',
})
export class CollectionsApiFacade {
  private readonly store = inject(Store);

  readonly collections = this.store.selectSignal(selectCollections);
  readonly loading = this.store.selectSignal(selectCollectionsLoading);
  readonly saving = this.store.selectSignal(selectCollectionsSaving);
  readonly deleting = this.store.selectSignal(selectCollectionsDeleting);
  readonly error = this.store.selectSignal(selectCollectionsError);

  loadCollections(): void {
    this.store.dispatch(CollectionsApiActions.loadCollections());
  }

  addCollection(collection: CreateCollectionPayload): void {
    this.store.dispatch(CollectionsApiActions.addCollection({ collection }));
  }

  updateCollection(collection: UpdateCollectionPayload): void {
    this.store.dispatch(CollectionsApiActions.updateCollection({ collection }));
  }

  deleteCollection(id: string): void {
    this.store.dispatch(CollectionsApiActions.deleteCollection({ id }));
  }
}
