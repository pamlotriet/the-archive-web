export type Collection = {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type CreateCollectionPayload = Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCollectionPayload = Partial<CreateCollectionPayload> & {
  id: string;
};
