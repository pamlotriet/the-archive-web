import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import { LibraryApiActions, LibraryApiService } from '@features/library/state/library-api';

@Injectable()
export class LibraryApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly libraryApiService = inject(LibraryApiService);

  readonly loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryApiActions.loadItems),
      exhaustMap(() =>
        this.libraryApiService.loadItems().then(
          (items) => LibraryApiActions.loadItemsSuccess({ items }),
          (error: unknown) =>
            LibraryApiActions.loadItemsFailure({
              error: error instanceof Error ? error.message : 'Unable to load library items',
            }),
        ),
      ),
    ),
  );

  readonly addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryApiActions.addItem),
      exhaustMap(({ item }) =>
        this.libraryApiService.addItem(item).then(
          (createdItem) => LibraryApiActions.addItemSuccess({ item: createdItem }),
          (error: unknown) =>
            LibraryApiActions.addItemFailure({
              error: error instanceof Error ? error.message : 'Unable to add library item',
            }),
        ),
      ),
    ),
  );

  readonly updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryApiActions.updateItem),
      exhaustMap(({ item }) =>
        this.libraryApiService.updateItem(item).then(
          (updatedItem) => LibraryApiActions.updateItemSuccess({ item: updatedItem }),
          (error: unknown) =>
            LibraryApiActions.updateItemFailure({
              error: error instanceof Error ? error.message : 'Unable to update library item',
            }),
        ),
      ),
    ),
  );

  readonly deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryApiActions.deleteItem),
      exhaustMap(({ id }) =>
        this.libraryApiService.deleteItem(id).then(
          (deletedItemId) => LibraryApiActions.deleteItemSuccess({ id: deletedItemId }),
          (error: unknown) =>
            LibraryApiActions.deleteItemFailure({
              error: error instanceof Error ? error.message : 'Unable to delete library item',
            }),
        ),
      ),
    ),
  );
}
