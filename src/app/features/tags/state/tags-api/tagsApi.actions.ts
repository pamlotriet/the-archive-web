import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CreateTagPayload, Tag, UpdateTagPayload } from '../../types/tag.types';

export const TagsApiActions = createActionGroup({
  source: 'TagsApi',
  events: {
    loadTags: emptyProps(),
    loadTagsSuccess: props<{ tags: Tag[] }>(),
    loadTagsFailure: props<{ error: string }>(),
    addTag: props<{ tag: CreateTagPayload }>(),
    addTagSuccess: props<{ tag: Tag }>(),
    addTagFailure: props<{ error: string }>(),
    updateTag: props<{ tag: UpdateTagPayload }>(),
    updateTagSuccess: props<{ tag: Tag }>(),
    updateTagFailure: props<{ error: string }>(),
    deleteTag: props<{ id: string }>(),
    deleteTagSuccess: props<{ id: string }>(),
    deleteTagFailure: props<{ error: string }>(),
    incrementTagCount: props<{ id: string }>(),
    incrementTagCountSuccess: props<{ id: string }>(),
    incrementTagCountFailure: props<{ error: string }>(),
  },
});
