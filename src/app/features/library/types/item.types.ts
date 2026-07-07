export type Item = {
  id: string;
  title: string;
  description: string;
  category: category;
  imageUrl: string;
  author: string;
  producer: string;
  rating: number;
  status: status;
  progress: number;
  currentPage?: number;
  totalPages?: number;
};

export type category =
  'books' | 'movies' | 'series' | 'games' | 'music' | 'podcasts' | 'audioBooks';

export type status =
  | 'wantToWatch'
  | 'watching'
  | 'watched'
  | 'wantToRead'
  | 'reading'
  | 'read'
  | 'wantToPlay'
  | 'playing'
  | 'played'
  | 'wantToListen'
  | 'listening'
  | 'listened';

export const STATUS_LABEL_KEYS = {
  wantToWatch: 'library.statuses.wantToWatch',
  watching: 'library.statuses.watching',
  watched: 'library.statuses.watched',
  wantToRead: 'library.statuses.wantToRead',
  reading: 'library.statuses.reading',
  read: 'library.statuses.read',
  wantToPlay: 'library.statuses.wantToPlay',
  playing: 'library.statuses.playing',
  played: 'library.statuses.played',
  wantToListen: 'library.statuses.wantToListen',
  listening: 'library.statuses.listening',
  listened: 'library.statuses.listened',
} as const satisfies Record<status, string>;
