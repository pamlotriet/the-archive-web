export type Note = {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  itemId?: string;
  pinned: boolean;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type CreateNotePayload = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateNotePayload = Partial<CreateNotePayload> & {
  id: string;
};
