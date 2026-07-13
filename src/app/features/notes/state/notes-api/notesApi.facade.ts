import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { CreateNotePayload, UpdateNotePayload } from '../../types/note.types';
import { NotesApiActions } from './notesApi.actions';
import {
  selectNotes,
  selectNotesDeleting,
  selectNotesError,
  selectNotesLoading,
  selectNotesSaving,
} from './notesApi.selectors';

@Injectable({
  providedIn: 'root',
})
export class NotesApiFacade {
  private readonly store = inject(Store);

  readonly notes = this.store.selectSignal(selectNotes);
  readonly loading = this.store.selectSignal(selectNotesLoading);
  readonly saving = this.store.selectSignal(selectNotesSaving);
  readonly deleting = this.store.selectSignal(selectNotesDeleting);
  readonly error = this.store.selectSignal(selectNotesError);

  loadNotes(): void {
    this.store.dispatch(NotesApiActions.loadNotes());
  }

  addNote(note: CreateNotePayload): void {
    this.store.dispatch(NotesApiActions.addNote({ note }));
  }

  updateNote(note: UpdateNotePayload): void {
    this.store.dispatch(NotesApiActions.updateNote({ note }));
  }

  deleteNote(id: string): void {
    this.store.dispatch(NotesApiActions.deleteNote({ id }));
  }
}
