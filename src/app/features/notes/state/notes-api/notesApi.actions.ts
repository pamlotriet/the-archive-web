import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CreateNotePayload, Note, UpdateNotePayload } from '../../types/note.types';

export const NotesApiActions = createActionGroup({
  source: 'NotesApi',
  events: {
    loadNotes: emptyProps(),
    loadNotesSuccess: props<{ notes: Note[] }>(),
    loadNotesFailure: props<{ error: string }>(),
    addNote: props<{ note: CreateNotePayload }>(),
    addNoteSuccess: props<{ note: Note }>(),
    addNoteFailure: props<{ error: string }>(),
    updateNote: props<{ note: UpdateNotePayload }>(),
    updateNoteSuccess: props<{ note: Note }>(),
    updateNoteFailure: props<{ error: string }>(),
    deleteNote: props<{ id: string }>(),
    deleteNoteSuccess: props<{ id: string }>(),
    deleteNoteFailure: props<{ error: string }>(),
  },
});
