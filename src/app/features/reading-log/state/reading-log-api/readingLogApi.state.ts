import type { ReadingLogEntry } from '../../types/reading-log.types';

export interface ReadingLogApiState {
  logs: ReadingLogEntry[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialState: ReadingLogApiState = {
  logs: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};
