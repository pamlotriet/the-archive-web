import { createReducer, on } from '@ngrx/store';
import { NotesApiActions } from '@features/notes/state/notes-api/notesApi.actions';
import { initialState } from '@features/notes/state/notes-api/notesApi.state';

export const notesApiFeatureKey = 'notesApi';

export const notesApiReducer = createReducer(
  initialState,
  on(NotesApiActions.loadNotes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(NotesApiActions.loadNotesSuccess, (state, { notes }) => ({
    ...state,
    loading: false,
    notes,
  })),
  on(NotesApiActions.loadNotesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(NotesApiActions.addNote, NotesApiActions.updateNote, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(NotesApiActions.addNoteSuccess, (state, { note }) => ({
    ...state,
    saving: false,
    notes: [note, ...state.notes],
  })),
  on(NotesApiActions.updateNoteSuccess, (state, { note }) => ({
    ...state,
    saving: false,
    notes: state.notes.map((existingNote) => (existingNote.id === note.id ? note : existingNote)),
  })),
  on(NotesApiActions.addNoteFailure, NotesApiActions.updateNoteFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),
  on(NotesApiActions.deleteNote, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(NotesApiActions.deleteNoteSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    notes: state.notes.filter((note) => note.id !== id),
  })),
  on(NotesApiActions.deleteNoteFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),
);
