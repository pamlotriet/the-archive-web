import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import { NotesApiActions, NotesApiService } from '@features/notes/state/notes-api';

@Injectable()
export class NotesApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly notesApiService = inject(NotesApiService);

  readonly loadNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesApiActions.loadNotes),
      exhaustMap(() =>
        this.notesApiService.loadNotes().then(
          (notes) => NotesApiActions.loadNotesSuccess({ notes }),
          (error: unknown) =>
            NotesApiActions.loadNotesFailure({
              error: error instanceof Error ? error.message : 'Unable to load notes',
            }),
        ),
      ),
    ),
  );

  readonly addNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesApiActions.addNote),
      exhaustMap(({ note }) =>
        this.notesApiService.addNote(note).then(
          (createdNote) => NotesApiActions.addNoteSuccess({ note: createdNote }),
          (error: unknown) =>
            NotesApiActions.addNoteFailure({
              error: error instanceof Error ? error.message : 'Unable to add note',
            }),
        ),
      ),
    ),
  );

  readonly updateNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesApiActions.updateNote),
      exhaustMap(({ note }) =>
        this.notesApiService.updateNote(note).then(
          (updatedNote) => NotesApiActions.updateNoteSuccess({ note: updatedNote }),
          (error: unknown) =>
            NotesApiActions.updateNoteFailure({
              error: error instanceof Error ? error.message : 'Unable to update note',
            }),
        ),
      ),
    ),
  );

  readonly deleteNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotesApiActions.deleteNote),
      exhaustMap(({ id }) =>
        this.notesApiService.deleteNote(id).then(
          (deletedNoteId) => NotesApiActions.deleteNoteSuccess({ id: deletedNoteId }),
          (error: unknown) =>
            NotesApiActions.deleteNoteFailure({
              error: error instanceof Error ? error.message : 'Unable to delete note',
            }),
        ),
      ),
    ),
  );
}
