import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type {
  CreateQuotePayload,
  Quote,
  UpdateQuotePayload,
} from '@features/quotes/types/quote.types';

export const QuotesApiActions = createActionGroup({
  source: 'QuotesApi',
  events: {
    loadQuotes: emptyProps(),
    loadQuotesSuccess: props<{ quotes: Quote[] }>(),
    loadQuotesFailure: props<{ error: string }>(),
    addQuote: props<{ quote: CreateQuotePayload }>(),
    addQuoteSuccess: props<{ quote: Quote }>(),
    addQuoteFailure: props<{ error: string }>(),
    updateQuote: props<{ quote: UpdateQuotePayload }>(),
    updateQuoteSuccess: props<{ quote: Quote }>(),
    updateQuoteFailure: props<{ error: string }>(),
    deleteQuote: props<{ id: string }>(),
    deleteQuoteSuccess: props<{ id: string }>(),
    deleteQuoteFailure: props<{ error: string }>(),
  },
});
