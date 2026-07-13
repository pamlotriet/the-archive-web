export type ReadingLogMode = 'reading' | 'listening';
export type ReadingLogPeriod = 'week' | 'month' | 'year';

export type ReadingLogEntry = {
  id: string;
  itemId: string;
  itemTitle: string;
  mode: ReadingLogMode;
  pages: number;
  minutes: number;
  startedAt: number;
  endedAt: number;
  note?: string;
  createdAt?: number | null;
  updatedAt?: number | null;
};

export type CreateReadingLogEntryPayload = Omit<
  ReadingLogEntry,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateReadingLogEntryPayload = Partial<CreateReadingLogEntryPayload> & {
  id: string;
};
