import { createReducer, on } from '@ngrx/store';
import { initialState, ReadingLogApiActions } from '@features/reading-log/state/reading-log-api';

export const readingLogApiFeatureKey = 'readingLogApi';

export const readingLogApiReducer = createReducer(
  initialState,
  on(ReadingLogApiActions.loadReadingLogs, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReadingLogApiActions.loadReadingLogsSuccess, (state, { logs }) => ({
    ...state,
    loading: false,
    logs,
  })),
  on(ReadingLogApiActions.loadReadingLogsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ReadingLogApiActions.addReadingLog, ReadingLogApiActions.updateReadingLog, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(ReadingLogApiActions.addReadingLogSuccess, (state, { log }) => ({
    ...state,
    saving: false,
    logs: [log, ...state.logs],
  })),
  on(ReadingLogApiActions.updateReadingLogSuccess, (state, { log }) => ({
    ...state,
    saving: false,
    logs: state.logs.map((existingLog) => (existingLog.id === log.id ? log : existingLog)),
  })),
  on(
    ReadingLogApiActions.addReadingLogFailure,
    ReadingLogApiActions.updateReadingLogFailure,
    (state, { error }) => ({
      ...state,
      saving: false,
      error,
    }),
  ),
  on(ReadingLogApiActions.deleteReadingLog, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(ReadingLogApiActions.deleteReadingLogSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    logs: state.logs.filter((log) => log.id !== id),
  })),
  on(ReadingLogApiActions.deleteReadingLogFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),
);
