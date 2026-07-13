import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import { CollectionsApiActions } from './collectionsApi.actions';
import { CollectionsApiService } from './collectionsApi.service';

@Injectable()
export class CollectionsApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly collectionsApiService = inject(CollectionsApiService);

  readonly loadCollections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsApiActions.loadCollections),
      exhaustMap(() =>
        this.collectionsApiService.loadCollections().then(
          (collections) => CollectionsApiActions.loadCollectionsSuccess({ collections }),
          (error: unknown) =>
            CollectionsApiActions.loadCollectionsFailure({
              error: error instanceof Error ? error.message : 'Unable to load collections',
            }),
        ),
      ),
    ),
  );

  readonly addCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsApiActions.addCollection),
      exhaustMap(({ collection }) =>
        this.collectionsApiService.addCollection(collection).then(
          (createdCollection) =>
            CollectionsApiActions.addCollectionSuccess({ collection: createdCollection }),
          (error: unknown) =>
            CollectionsApiActions.addCollectionFailure({
              error: error instanceof Error ? error.message : 'Unable to add collection',
            }),
        ),
      ),
    ),
  );

  readonly updateCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsApiActions.updateCollection),
      exhaustMap(({ collection }) =>
        this.collectionsApiService.updateCollection(collection).then(
          (updatedCollection) =>
            CollectionsApiActions.updateCollectionSuccess({ collection: updatedCollection }),
          (error: unknown) =>
            CollectionsApiActions.updateCollectionFailure({
              error: error instanceof Error ? error.message : 'Unable to update collection',
            }),
        ),
      ),
    ),
  );

  readonly deleteCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionsApiActions.deleteCollection),
      exhaustMap(({ id }) =>
        this.collectionsApiService.deleteCollection(id).then(
          (deletedCollectionId) =>
            CollectionsApiActions.deleteCollectionSuccess({ id: deletedCollectionId }),
          (error: unknown) =>
            CollectionsApiActions.deleteCollectionFailure({
              error: error instanceof Error ? error.message : 'Unable to delete collection',
            }),
        ),
      ),
    ),
  );
}
