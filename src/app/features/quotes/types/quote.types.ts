export type Quote = {
  id: string;
  text: string;
  author: string;
  source: string;
  itemId?: string;
  note?: string;
  favorite: boolean;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type CreateQuotePayload = Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateQuotePayload = Partial<CreateQuotePayload> & {
  id: string;
};
