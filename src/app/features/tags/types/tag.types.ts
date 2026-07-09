export type Tag = {
  id: string;
  name: string;
  color: string;
  count: number;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type CreateTagPayload = {
  name: string;
  color: string;
};

export type UpdateTagPayload = Partial<CreateTagPayload> & {
  id: string;
};
