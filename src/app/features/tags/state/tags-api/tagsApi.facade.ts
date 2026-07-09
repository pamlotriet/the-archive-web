import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { CreateTagPayload, UpdateTagPayload } from '../../types/tag.types';
import { TagsApiActions } from './tagsApi.actions';
import {
  selectTags,
  selectTagsDeleting,
  selectTagsError,
  selectTagsLoading,
  selectTagsSaving,
} from './tagsApi.selectors';

@Injectable({
  providedIn: 'root',
})
export class TagsApiFacade {
  private readonly store = inject(Store);

  readonly tags = this.store.selectSignal(selectTags);
  readonly loading = this.store.selectSignal(selectTagsLoading);
  readonly saving = this.store.selectSignal(selectTagsSaving);
  readonly deleting = this.store.selectSignal(selectTagsDeleting);
  readonly error = this.store.selectSignal(selectTagsError);

  loadTags(): void {
    this.store.dispatch(TagsApiActions.loadTags());
  }

  addTag(tag: CreateTagPayload): void {
    this.store.dispatch(TagsApiActions.addTag({ tag }));
  }

  updateTag(tag: UpdateTagPayload): void {
    this.store.dispatch(TagsApiActions.updateTag({ tag }));
  }

  deleteTag(id: string): void {
    this.store.dispatch(TagsApiActions.deleteTag({ id }));
  }

  incrementTagCount(id: string): void {
    this.store.dispatch(TagsApiActions.incrementTagCount({ id }));
  }
}
