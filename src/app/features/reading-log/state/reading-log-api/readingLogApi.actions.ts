import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  CreateReadingLogEntryPayload,
  ReadingLogEntry,
  UpdateReadingLogEntryPayload,
} from '../../types/reading-log.types';

export const ReadingLogApiActions = createActionGroup({
  source: 'ReadingLogApi',
  events: {
    loadReadingLogs: emptyProps(),
    loadReadingLogsSuccess: props<{ logs: ReadingLogEntry[] }>(),
    loadReadingLogsFailure: props<{ error: string }>(),
    addReadingLog: props<{ log: CreateReadingLogEntryPayload }>(),
    addReadingLogSuccess: props<{ log: ReadingLogEntry }>(),
    addReadingLogFailure: props<{ error: string }>(),
    updateReadingLog: props<{ log: UpdateReadingLogEntryPayload }>(),
    updateReadingLogSuccess: props<{ log: ReadingLogEntry }>(),
    updateReadingLogFailure: props<{ error: string }>(),
    deleteReadingLog: props<{ id: string }>(),
    deleteReadingLogSuccess: props<{ id: string }>(),
    deleteReadingLogFailure: props<{ error: string }>(),
  },
});
