import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/button/button';
import { ReadingLogApiFacade } from '@features/reading-log/state/reading-log-api';
import type { ReadingLogMode } from '@features/reading-log/types/reading-log.types';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { NewEntryDialogComponent } from '../../components/new-entry-dialog/new-entry-dialog.component';
import { LibraryApiFacade } from '../../state/library-api';
import type { LibraryStatusFilter } from '../../state/library-api';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../../types/item.types';

@Component({
  selector: 'app-library',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [TranslatePipe, ButtonComponent, ItemCardComponent, NewEntryDialogComponent, PIcon],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
})
export class LibraryComponent implements OnInit, OnDestroy {
  private readonly libraryApiFacade = inject(LibraryApiFacade);
  private readonly readingLogApiFacade = inject(ReadingLogApiFacade);

  protected readonly allItems = this.libraryApiFacade.allItems;
  protected readonly items = this.libraryApiFacade.items;
  protected readonly entriesAmount = this.libraryApiFacade.totalItems;
  protected readonly currentPage = this.libraryApiFacade.page;
  protected readonly totalPages = this.libraryApiFacade.totalPages;
  protected readonly pageSize = this.libraryApiFacade.pageSize;
  protected readonly searchTerm = this.libraryApiFacade.searchTerm;
  protected readonly selectedCategory = this.libraryApiFacade.categoryFilter;
  protected readonly selectedStatus = this.libraryApiFacade.statusFilter;
  protected readonly isLoading = this.libraryApiFacade.loading;
  protected readonly error = this.libraryApiFacade.error;

  protected readonly viewMode = signal<'grid' | 'list'>('grid');
  protected readonly isNewEntryOpen = signal(false);
  protected readonly editingItem = signal<Item | null>(null);
  protected readonly isReadingLogOpen = signal(false);
  protected readonly logItemId = signal('');
  protected readonly logMode = signal<ReadingLogMode>('reading');
  protected readonly logPages = signal(0);
  protected readonly logMinutes = signal(0);
  protected readonly logNote = signal('');
  protected readonly timerStartedAt = signal<number | null>(null);
  protected readonly elapsedSeconds = signal(0);
  protected readonly loggableItems = computed(() =>
    this.allItems().filter((item) => this.canLogSession(item)),
  );
  protected readonly selectedLogItem = computed(
    () => this.loggableItems().find((item) => item.id === this.logItemId()) ?? null,
  );
  protected readonly timerLabel = computed(() => this.formatSeconds(this.elapsedSeconds()));
  protected readonly canSaveReadingLog = computed(() => {
    const item = this.selectedLogItem();

    return Boolean(item) && (this.logPages() > 0 || this.currentLogMinutes() > 0);
  });

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly categories = [
    { id: 'all', labelKey: 'library.categories.all', contentKey: 'library.content.all' },
    { id: 'books', labelKey: 'library.categories.books', contentKey: 'library.content.books' },
    { id: 'movies', labelKey: 'library.categories.movies', contentKey: 'library.content.movies' },
    { id: 'series', labelKey: 'library.categories.series', contentKey: 'library.content.series' },
    { id: 'games', labelKey: 'library.categories.games', contentKey: 'library.content.games' },
    { id: 'music', labelKey: 'library.categories.music', contentKey: 'library.content.music' },
    {
      id: 'podcasts',
      labelKey: 'library.categories.podcasts',
      contentKey: 'library.content.podcasts',
    },
    {
      id: 'audioBooks',
      labelKey: 'library.categories.audioBooks',
      contentKey: 'library.content.audioBooks',
    },
  ] as const;

  protected readonly statusFilters = [
    { id: 'all', labelKey: 'library.statusFilters.all' },
    { id: 'wantToStart', labelKey: 'library.statusFilters.wantToStart' },
    { id: 'inProgress', labelKey: 'library.statusFilters.inProgress' },
    { id: 'completed', labelKey: 'library.statusFilters.completed' },
  ] as const;

  ngOnInit(): void {
    this.libraryApiFacade.loadItems();
    this.readingLogApiFacade.loadReadingLogs();
  }

  ngOnDestroy(): void {
    this.stopTimerInterval();
  }

  protected setSearchTerm(event: Event): void {
    this.libraryApiFacade.setSearchTerm((event.target as HTMLInputElement).value);
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  protected selectCategory(category: CategoryId): void {
    this.libraryApiFacade.setCategoryFilter(category);
  }

  protected selectStatus(statusFilter: StatusFilterId): void {
    this.libraryApiFacade.setStatusFilter(statusFilter);
  }

  protected setPageSize(event: Event): void {
    this.libraryApiFacade.setPageSize(Number((event.target as HTMLSelectElement).value));
  }

  protected previousPage(): void {
    this.libraryApiFacade.setPage(this.currentPage() - 1);
  }

  protected nextPage(): void {
    this.libraryApiFacade.setPage(this.currentPage() + 1);
  }

  protected openNewEntry(): void {
    this.editingItem.set(null);
    this.isNewEntryOpen.set(true);
  }

  protected openReadingLog(item?: Item): void {
    const selectedItem = item ?? this.loggableItems()[0] ?? null;

    this.resetReadingLogForm();

    if (selectedItem) {
      this.logItemId.set(selectedItem.id);
      this.logMode.set(selectedItem.category === 'audioBooks' ? 'listening' : 'reading');
    }

    this.isReadingLogOpen.set(true);
  }

  protected editItem(item: Item): void {
    this.editingItem.set(item);
    this.isNewEntryOpen.set(true);
  }

  protected saveItem(item: CreateItemPayload | Item): void {
    if (this.isExistingItem(item)) {
      this.libraryApiFacade.updateItem(item);
    } else {
      this.libraryApiFacade.addItem(item);
    }
  }

  protected deleteItem(id: string): void {
    this.libraryApiFacade.deleteItem(id);
  }

  protected closeReadingLog(): void {
    this.stopTimer();
    this.isReadingLogOpen.set(false);
    this.resetReadingLogForm();
  }

  protected setLogItem(event: Event): void {
    const itemId = (event.target as HTMLSelectElement).value;
    const item = this.loggableItems().find((loggableItem) => loggableItem.id === itemId);

    this.logItemId.set(itemId);
    this.logMode.set(item?.category === 'audioBooks' ? 'listening' : 'reading');
    this.logPages.set(0);
  }

  protected setLogMode(mode: ReadingLogMode): void {
    this.logMode.set(mode);

    if (mode === 'listening') {
      this.logPages.set(0);
    }
  }

  protected setLogPages(event: Event): void {
    this.logPages.set(this.inputNumber(event));
  }

  protected setLogMinutes(event: Event): void {
    this.logMinutes.set(this.inputNumber(event));
  }

  protected setLogNote(event: Event): void {
    this.logNote.set((event.target as HTMLTextAreaElement).value);
  }

  protected startTimer(): void {
    if (this.timerStartedAt()) {
      return;
    }

    this.timerStartedAt.set(Date.now());
    this.elapsedSeconds.set(0);
    this.stopTimerInterval();
    this.timerInterval = setInterval(() => {
      const startedAt = this.timerStartedAt();

      if (startedAt) {
        this.elapsedSeconds.set(Math.floor((Date.now() - startedAt) / 1000));
      }
    }, 1000);
  }

  protected stopTimer(): void {
    if (!this.timerStartedAt()) {
      return;
    }

    this.logMinutes.set(Math.max(1, Math.ceil(this.elapsedSeconds() / 60)));
    this.timerStartedAt.set(null);
    this.stopTimerInterval();
  }

  protected resetTimer(): void {
    this.timerStartedAt.set(null);
    this.elapsedSeconds.set(0);
    this.stopTimerInterval();
  }

  protected saveReadingLog(): void {
    const item = this.selectedLogItem();

    if (!item || !this.canSaveReadingLog()) {
      return;
    }

    const minutes = this.currentLogMinutes();
    const pages = this.shouldShowPageLogging(item) ? this.logPages() : 0;
    const endedAt = Date.now();
    const startedAt = this.timerStartedAt() ?? endedAt - Math.max(minutes, 1) * 60_000;

    this.readingLogApiFacade.addReadingLog({
      itemId: item.id,
      itemTitle: item.title,
      mode: this.logMode(),
      pages,
      minutes,
      startedAt,
      endedAt,
      note: this.logNote().trim() || undefined,
    });

    if (pages > 0 && item.category === 'books') {
      this.updateBookProgress(item, pages);
    }

    this.closeReadingLog();
  }

  protected shouldShowPageLogging(item: Item | null): boolean {
    return item?.category === 'books' && this.logMode() === 'reading';
  }

  protected closeNewEntry(): void {
    this.isNewEntryOpen.set(false);
    this.editingItem.set(null);
  }

  protected itemsGridClass(): string {
    return this.viewMode() === 'grid'
      ? 'mt-8 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4'
      : 'mt-8 max-w-6xl overflow-visible rounded-2xl border border-border bg-card';
  }

  private isExistingItem(item: CreateItemPayload | Item): item is UpdateItemPayload & Item {
    return 'id' in item && Boolean(item.id);
  }

  private canLogSession(item: Item): boolean {
    return item.category === 'books' || item.category === 'audioBooks';
  }

  private currentLogMinutes(): number {
    if (this.timerStartedAt()) {
      return Math.max(1, Math.ceil(this.elapsedSeconds() / 60));
    }

    return Math.max(this.logMinutes(), 0);
  }

  private updateBookProgress(item: Item, pages: number): void {
    const currentPage = Math.max(item.currentPage ?? 0, 0) + pages;
    const boundedCurrentPage = item.totalPages ? Math.min(currentPage, item.totalPages) : currentPage;
    const progress = item.totalPages
      ? Math.min(100, Math.round((boundedCurrentPage / item.totalPages) * 100))
      : item.progress;

    this.libraryApiFacade.updateItem({
      id: item.id,
      currentPage: boundedCurrentPage,
      progress,
      status: progress >= 100 ? 'read' : item.status === 'wantToRead' ? 'reading' : item.status,
    });
  }

  private resetReadingLogForm(): void {
    this.logItemId.set('');
    this.logMode.set('reading');
    this.logPages.set(0);
    this.logMinutes.set(0);
    this.logNote.set('');
    this.resetTimer();
  }

  private inputNumber(event: Event): number {
    return Math.max(Number((event.target as HTMLInputElement).value) || 0, 0);
  }

  private formatSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((value) => value.toString().padStart(2, '0'))
      .join(':');
  }

  private stopTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}

type CategoryId = LibraryComponent['categories'][number]['id'];
type StatusFilterId = LibraryStatusFilter;
