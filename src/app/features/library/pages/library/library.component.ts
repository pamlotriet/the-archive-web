import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/button/button';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { eventValue } from '@app/shared/utils/form-event';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { NewEntryDialogComponent } from '../../components/new-entry-dialog/new-entry-dialog.component';
import { ReadingLogDialogComponent } from '../../components/reading-log-dialog/reading-log-dialog.component';
import { LibraryApiFacade } from '../../state/library-api';
import type { LibraryStatusFilter } from '../../state/library-api';
import type { CreateItemPayload, Item, UpdateItemPayload } from '../../types/item.types';

@Component({
  selector: 'app-library',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [
    TranslatePipe,
    ButtonComponent,
    PageHeaderComponent,
    ItemCardComponent,
    NewEntryDialogComponent,
    ReadingLogDialogComponent,
    PIcon,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
})
export class LibraryComponent implements OnInit {
  private readonly libraryApiFacade = inject(LibraryApiFacade);

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
  }

  protected setSearchTerm(event: Event): void {
    this.libraryApiFacade.setSearchTerm(eventValue(event));
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
    this.libraryApiFacade.setPageSize(Number(eventValue(event)));
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

  protected openReadingLog(): void {
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
    this.isReadingLogOpen.set(false);
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

  protected updateBookProgress({ item, pages }: { item: Item; pages: number }): void {
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
}

type CategoryId = LibraryComponent['categories'][number]['id'];
type StatusFilterId = LibraryStatusFilter;
