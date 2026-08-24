import { createReducer, on } from '@ngrx/store';
import { QuotesApiActions, initialState } from '@features/quotes/state/quotes-api';

export const quotesApiFeatureKey = 'quotesApi';

export const quotesApiReducer = createReducer(
  initialState,
  on(QuotesApiActions.loadQuotes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(QuotesApiActions.loadQuotesSuccess, (state, { quotes }) => ({
    ...state,
    loading: false,
    quotes,
  })),
  on(QuotesApiActions.loadQuotesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(QuotesApiActions.addQuote, QuotesApiActions.updateQuote, (state) => ({
    ...state,
    saving: true,
    error: null,
  })),
  on(QuotesApiActions.addQuoteSuccess, (state, { quote }) => ({
    ...state,
    saving: false,
    quotes: [quote, ...state.quotes],
  })),
  on(QuotesApiActions.updateQuoteSuccess, (state, { quote }) => ({
    ...state,
    saving: false,
    quotes: state.quotes.map((existingQuote) =>
      existingQuote.id === quote.id ? quote : existingQuote,
    ),
  })),
  on(QuotesApiActions.addQuoteFailure, QuotesApiActions.updateQuoteFailure, (state, { error }) => ({
    ...state,
    saving: false,
    error,
  })),
  on(QuotesApiActions.deleteQuote, (state) => ({
    ...state,
    deleting: true,
    error: null,
  })),
  on(QuotesApiActions.deleteQuoteSuccess, (state, { id }) => ({
    ...state,
    deleting: false,
    quotes: state.quotes.filter((quote) => quote.id !== id),
  })),
  on(QuotesApiActions.deleteQuoteFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    error,
  })),
);
