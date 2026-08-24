import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, mergeMap } from 'rxjs';
import { TagsApiActions, TagsApiService } from '@features/tags/state/tags-api';

@Injectable()
export class TagsApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly tagsApiService = inject(TagsApiService);

  readonly loadTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagsApiActions.loadTags),
      exhaustMap(() =>
        this.tagsApiService.loadTags().then(
          (tags) => TagsApiActions.loadTagsSuccess({ tags }),
          (error: unknown) =>
            TagsApiActions.loadTagsFailure({
              error: error instanceof Error ? error.message : 'Unable to load tags',
            }),
        ),
      ),
    ),
  );

  readonly addTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagsApiActions.addTag),
      exhaustMap(({ tag }) =>
        this.tagsApiService.addTag(tag).then(
          (createdTag) => TagsApiActions.addTagSuccess({ tag: createdTag }),
          (error: unknown) =>
            TagsApiActions.addTagFailure({
              error: error instanceof Error ? error.message : 'Unable to add tag',
            }),
        ),
      ),
    ),
  );

  readonly updateTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagsApiActions.updateTag),
      exhaustMap(({ tag }) =>
        this.tagsApiService.updateTag(tag).then(
          (updatedTag) => TagsApiActions.updateTagSuccess({ tag: updatedTag }),
          (error: unknown) =>
            TagsApiActions.updateTagFailure({
              error: error instanceof Error ? error.message : 'Unable to update tag',
            }),
        ),
      ),
    ),
  );

  readonly deleteTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagsApiActions.deleteTag),
      exhaustMap(({ id }) =>
        this.tagsApiService.deleteTag(id).then(
          (deletedTagId) => TagsApiActions.deleteTagSuccess({ id: deletedTagId }),
          (error: unknown) =>
            TagsApiActions.deleteTagFailure({
              error: error instanceof Error ? error.message : 'Unable to delete tag',
            }),
        ),
      ),
    ),
  );

  readonly incrementTagCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TagsApiActions.incrementTagCount),
      mergeMap(({ id }) =>
        this.tagsApiService.incrementTagCount(id).then(
          (updatedTagId) => TagsApiActions.incrementTagCountSuccess({ id: updatedTagId }),
          (error: unknown) =>
            TagsApiActions.incrementTagCountFailure({
              error: error instanceof Error ? error.message : 'Unable to update tag count',
            }),
        ),
      ),
    ),
  );
}
