import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { CreateQuotePayload, UpdateQuotePayload } from '../../types/quote.types';
import { QuotesApiActions } from './quotesApi.actions';
import {
  selectQuotes,
  selectQuotesDeleting,
  selectQuotesError,
  selectQuotesLoading,
  selectQuotesSaving,
} from './quotesApi.selectors';

@Injectable({
  providedIn: 'root',
})
export class QuotesApiFacade {
  private readonly store = inject(Store);

  readonly quotes = this.store.selectSignal(selectQuotes);
  readonly loading = this.store.selectSignal(selectQuotesLoading);
  readonly saving = this.store.selectSignal(selectQuotesSaving);
  readonly deleting = this.store.selectSignal(selectQuotesDeleting);
  readonly error = this.store.selectSignal(selectQuotesError);

  loadQuotes(): void {
    this.store.dispatch(QuotesApiActions.loadQuotes());
  }

  addQuote(quote: CreateQuotePayload): void {
    this.store.dispatch(QuotesApiActions.addQuote({ quote }));
  }

  updateQuote(quote: UpdateQuotePayload): void {
    this.store.dispatch(QuotesApiActions.updateQuote({ quote }));
  }

  deleteQuote(id: string): void {
    this.store.dispatch(QuotesApiActions.deleteQuote({ id }));
  }
}
