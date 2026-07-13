import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type {
  CreateReadingLogEntryPayload,
  UpdateReadingLogEntryPayload,
} from '../../types/reading-log.types';
import { ReadingLogApiActions } from './readingLogApi.actions';
import {
  selectReadingLogDeleting,
  selectReadingLogError,
  selectReadingLogLoading,
  selectReadingLogs,
  selectReadingLogSaving,
} from './readingLogApi.selectors';

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
