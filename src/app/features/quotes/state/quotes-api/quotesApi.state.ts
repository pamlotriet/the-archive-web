import type { Quote } from '@features/quotes/types/quote.types';

export interface QuotesApiState {
  quotes: Quote[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialState: QuotesApiState = {
  quotes: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};
