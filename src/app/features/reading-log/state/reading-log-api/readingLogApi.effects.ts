import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import {
  ReadingLogApiActions,
  ReadingLogApiService,
} from '@features/reading-log/state/reading-log-api';

@Injectable()
export class ReadingLogApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly readingLogApiService = inject(ReadingLogApiService);

  readonly loadReadingLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingLogApiActions.loadReadingLogs),
      exhaustMap(() =>
        this.readingLogApiService.loadReadingLogs().then(
          (logs) => ReadingLogApiActions.loadReadingLogsSuccess({ logs }),
          (error: unknown) =>
            ReadingLogApiActions.loadReadingLogsFailure({
              error: error instanceof Error ? error.message : 'Unable to load reading logs',
            }),
        ),
      ),
    ),
  );

  readonly addReadingLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingLogApiActions.addReadingLog),
      exhaustMap(({ log }) =>
        this.readingLogApiService.addReadingLog(log).then(
          (createdLog) => ReadingLogApiActions.addReadingLogSuccess({ log: createdLog }),
          (error: unknown) =>
            ReadingLogApiActions.addReadingLogFailure({
              error: error instanceof Error ? error.message : 'Unable to add reading log',
            }),
        ),
      ),
    ),
  );

  readonly updateReadingLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingLogApiActions.updateReadingLog),
      exhaustMap(({ log }) =>
        this.readingLogApiService.updateReadingLog(log).then(
          (updatedLog) => ReadingLogApiActions.updateReadingLogSuccess({ log: updatedLog }),
          (error: unknown) =>
            ReadingLogApiActions.updateReadingLogFailure({
              error: error instanceof Error ? error.message : 'Unable to update reading log',
            }),
        ),
      ),
    ),
  );

  readonly deleteReadingLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingLogApiActions.deleteReadingLog),
      exhaustMap(({ id }) =>
        this.readingLogApiService.deleteReadingLog(id).then(
          (deletedLogId) => ReadingLogApiActions.deleteReadingLogSuccess({ id: deletedLogId }),
          (error: unknown) =>
            ReadingLogApiActions.deleteReadingLogFailure({
              error: error instanceof Error ? error.message : 'Unable to delete reading log',
            }),
        ),
      ),
    ),
  );
}
