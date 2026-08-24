import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type {
  CreateReadingLogEntryPayload,
  UpdateReadingLogEntryPayload,
} from '@features/reading-log/types/reading-log.types';
import {
  selectReadingLogDeleting,
  selectReadingLogError,
  selectReadingLogLoading,
  selectReadingLogs,
  selectReadingLogSaving,
  ReadingLogApiActions,
} from '@features/reading-log/state/reading-log-api';

@Injectable({
  providedIn: 'root',
})
export class ReadingLogApiFacade {
  private readonly store = inject(Store);

  readonly logs = this.store.selectSignal(selectReadingLogs);
  readonly loading = this.store.selectSignal(selectReadingLogLoading);
  readonly saving = this.store.selectSignal(selectReadingLogSaving);
  readonly deleting = this.store.selectSignal(selectReadingLogDeleting);
  readonly error = this.store.selectSignal(selectReadingLogError);

  loadReadingLogs(): void {
    this.store.dispatch(ReadingLogApiActions.loadReadingLogs());
  }

  addReadingLog(log: CreateReadingLogEntryPayload): void {
    this.store.dispatch(ReadingLogApiActions.addReadingLog({ log }));
  }

  updateReadingLog(log: UpdateReadingLogEntryPayload): void {
    this.store.dispatch(ReadingLogApiActions.updateReadingLog({ log }));
  }

  deleteReadingLog(id: string): void {
    this.store.dispatch(ReadingLogApiActions.deleteReadingLog({ id }));
  }
}
