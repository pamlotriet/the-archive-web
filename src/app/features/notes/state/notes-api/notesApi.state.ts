import type { Note } from '../../types/note.types';

export interface NotesApiState {
  notes: Note[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialState: NotesApiState = {
  notes: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};
