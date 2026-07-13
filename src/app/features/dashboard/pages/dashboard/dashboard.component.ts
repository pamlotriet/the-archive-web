import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationApiFacade } from '@features/authentication/state/authentication-api';
import { CollectionsApiFacade } from '@features/collections/state/collections-api';
import { LibraryApiFacade } from '@features/library/state/library-api';
import type { Item, status } from '@features/library/types/item.types';
import { NotesApiFacade } from '@features/notes/state/notes-api';
import { QuotesApiFacade } from '@features/quotes/state/quotes-api';
import type { Quote } from '@features/quotes/types/quote.types';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';

@Component({
  selector: 'app-dashboard',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [PIcon, RouterLink, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly fallbackImageUrl = '/assets/images/library-login-background.png';
  private readonly authenticationApiFacade = inject(AuthenticationApiFacade);
  private readonly collectionsApiFacade = inject(CollectionsApiFacade);
  private readonly libraryApiFacade = inject(LibraryApiFacade);
  private readonly notesApiFacade = inject(NotesApiFacade);
  private readonly quotesApiFacade = inject(QuotesApiFacade);

  protected readonly user = this.authenticationApiFacade.user;
  protected readonly items = this.libraryApiFacade.allItems;
  protected readonly collections = this.collectionsApiFacade.collections;
  protected readonly notes = this.notesApiFacade.notes;
  protected readonly quotes = this.quotesApiFacade.quotes;

  protected readonly quickActions = [
    { labelKey: 'dashboard.quickActions.addEntry', icon: 'plus', route: '/library' },
    { labelKey: 'dashboard.quickActions.addQuote', icon: 'comment', route: '/quotes' },
    { labelKey: 'dashboard.quickActions.addNote', icon: 'file', route: '/notes' },
    { labelKey: 'dashboard.quickActions.newCollection', icon: 'folder-plus', route: '/collections' },
  ];

  protected readonly completedItems = computed(() =>
    this.items().filter((item) => this.isCompleted(item.status)),
  );
  protected readonly inProgressItems = computed(() =>
    this.items().filter((item) => this.isInProgress(item.status)),
  );
  protected readonly wantToStartItems = computed(() =>
    this.items().filter((item) => this.isWantToStart(item.status)),
  );
  protected readonly averageRating = computed(() => {
    const ratedItems = this.items().filter((item) => item.rating > 0);

    if (ratedItems.length === 0) {
      return '0.0';
    }

    return (
      ratedItems.reduce((total, item) => total + item.rating, 0) / ratedItems.length
    ).toFixed(1);
  });
  protected readonly quoteOfTheDay = computed(() => this.quotes().find((quote) => quote.favorite) ?? this.quotes()[0]);
  protected readonly continueItems = computed(() => this.inProgressItems().slice(0, 3));
  protected readonly recentItems = computed(() => this.items().slice(0, 6));
  protected readonly recentNotes = computed(() => this.notes().slice(0, 3));

  ngOnInit(): void {
    this.libraryApiFacade.loadItems();
    this.collectionsApiFacade.loadCollections();
    this.notesApiFacade.loadNotes();
    this.quotesApiFacade.loadQuotes();
  }

  protected userName(): string {
    const user = this.user();
    const fullName = [user?.name, user?.lastname].filter(Boolean).join(' ');

    return fullName || user?.displayName || 'there';
  }

  protected todayLabel(): string {
    return new Intl.DateTimeFormat('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  }

  protected creator(item: Item): string {
    return item.author || item.producer || 'Unknown creator';
  }

  protected itemInitials(item: Item): string {
    return item.title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  protected categoryIcon(item: Item): string {
    const icons = {
      books: 'book',
      movies: 'video',
      series: 'desktop',
      games: 'play-circle',
      music: 'volume-up',
      podcasts: 'microphone',
      audioBooks: 'headphones',
    } satisfies Record<Item['category'], string>;

    return icons[item.category];
  }

  protected imageSource(item: Item): string {
    return item.imageUrl || this.fallbackImageUrl;
  }

  protected useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.endsWith(this.fallbackImageUrl)) {
      return;
    }

    image.src = this.fallbackImageUrl;
  }

  protected quoteSource(quote: Quote): string {
    const linkedItem = quote.itemId
      ? this.items().find((item) => item.id === quote.itemId)
      : undefined;

    return quote.source || linkedItem?.title || 'Unknown source';
  }

  private isCompleted(itemStatus: status): boolean {
    return ['watched', 'read', 'played', 'listened'].includes(itemStatus);
  }

  private isInProgress(itemStatus: status): boolean {
    return ['watching', 'reading', 'playing', 'listening'].includes(itemStatus);
  }

  private isWantToStart(itemStatus: status): boolean {
    return ['wantToWatch', 'wantToRead', 'wantToPlay', 'wantToListen'].includes(itemStatus);
  }
}
