import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap } from 'rxjs';
import { QuotesApiActions, QuotesApiService } from '@features/quotes/state/quotes-api';

@Injectable()
export class QuotesApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly quotesApiService = inject(QuotesApiService);

  readonly loadQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesApiActions.loadQuotes),
      exhaustMap(() =>
        this.quotesApiService.loadQuotes().then(
          (quotes) => QuotesApiActions.loadQuotesSuccess({ quotes }),
          (error: unknown) =>
            QuotesApiActions.loadQuotesFailure({
              error: error instanceof Error ? error.message : 'Unable to load quotes',
            }),
        ),
      ),
    ),
  );

  readonly addQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesApiActions.addQuote),
      exhaustMap(({ quote }) =>
        this.quotesApiService.addQuote(quote).then(
          (createdQuote) => QuotesApiActions.addQuoteSuccess({ quote: createdQuote }),
          (error: unknown) =>
            QuotesApiActions.addQuoteFailure({
              error: error instanceof Error ? error.message : 'Unable to add quote',
            }),
        ),
      ),
    ),
  );

  readonly updateQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesApiActions.updateQuote),
      exhaustMap(({ quote }) =>
        this.quotesApiService.updateQuote(quote).then(
          (updatedQuote) => QuotesApiActions.updateQuoteSuccess({ quote: updatedQuote }),
          (error: unknown) =>
            QuotesApiActions.updateQuoteFailure({
              error: error instanceof Error ? error.message : 'Unable to update quote',
            }),
        ),
      ),
    ),
  );

  readonly deleteQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(QuotesApiActions.deleteQuote),
      exhaustMap(({ id }) =>
        this.quotesApiService.deleteQuote(id).then(
          (deletedQuoteId) => QuotesApiActions.deleteQuoteSuccess({ id: deletedQuoteId }),
          (error: unknown) =>
            QuotesApiActions.deleteQuoteFailure({
              error: error instanceof Error ? error.message : 'Unable to delete quote',
            }),
        ),
      ),
    ),
  );
}
