import { createFeatureSelector, createSelector } from '@ngrx/store';
import { notesApiFeatureKey } from './notesApi.reducer';
import type { NotesApiState } from './notesApi.state';

export const selectNotesApiState = createFeatureSelector<NotesApiState>(notesApiFeatureKey);

export const selectNotes = createSelector(selectNotesApiState, (state) => state.notes);
export const selectNotesLoading = createSelector(selectNotesApiState, (state) => state.loading);
export const selectNotesSaving = createSelector(selectNotesApiState, (state) => state.saving);
export const selectNotesDeleting = createSelector(selectNotesApiState, (state) => state.deleting);
export const selectNotesError = createSelector(selectNotesApiState, (state) => state.error);
