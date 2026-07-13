import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { CollectionsApiFacade } from '../../../collections/state/collections-api';
import { TagsApiFacade } from '../../../tags/state/tags-api';
import type { CreateItemPayload, Item, category, status } from '../../types/item.types';

@Component({
  selector: 'app-new-entry-dialog',
  imports: [PIcon, TranslatePipe],
  templateUrl: './new-entry-dialog.component.html',
  styleUrl: './new-entry-dialog.component.css',
})
export class NewEntryDialogComponent implements OnInit {
  private readonly tagsApiFacade = inject(TagsApiFacade);
  private readonly collectionsApiFacade = inject(CollectionsApiFacade);
  private readonly fallbackImageUrl = '/assets/images/library-login-background.png';

  readonly dialogClose = output<void>();
  readonly itemSave = output<CreateItemPayload | Item>();
  item = input<Item | null>(null);

  protected readonly title = signal('');
  protected readonly creator = signal('');
  protected readonly category = signal<category>('books');
  protected readonly statusMode = signal<'wantToStart' | 'inProgress' | 'completed'>('wantToStart');
  protected readonly rating = signal(0);
  protected readonly progress = signal(0);
  protected readonly currentPage = signal<number | undefined>(undefined);
  protected readonly totalPages = signal<number | undefined>(undefined);
  protected readonly selectedTagNames = signal<string[]>([]);
  protected readonly selectedCollectionIds = signal<string[]>([]);
  protected readonly note = signal('');
  protected readonly imageUrl = signal('');
  protected readonly firebaseTags = this.tagsApiFacade.tags;
  protected readonly collections = this.collectionsApiFacade.collections;

  protected readonly entryTypes = [
    { id: 'books', labelKey: 'library.newEntry.types.books' },
    { id: 'movies', labelKey: 'library.newEntry.types.movies' },
    { id: 'series', labelKey: 'library.newEntry.types.series' },
    { id: 'games', labelKey: 'library.newEntry.types.games' },
    { id: 'music', labelKey: 'library.newEntry.types.music' },
    { id: 'podcasts', labelKey: 'library.newEntry.types.podcasts' },
    { id: 'audioBooks', labelKey: 'library.newEntry.types.audioBooks' },
  ] as const satisfies ReadonlyArray<{ id: category; labelKey: string }>;

  protected readonly entryStatuses = [
    { id: 'wantToStart', labelKey: 'library.newEntry.statuses.wantToStart' },
    { id: 'inProgress', labelKey: 'library.newEntry.statuses.inProgress' },
    { id: 'completed', labelKey: 'library.newEntry.statuses.completed' },
  ] as const satisfies ReadonlyArray<{
    id: 'wantToStart' | 'inProgress' | 'completed';
    labelKey: string;
  }>;

  ngOnInit(): void {
    this.tagsApiFacade.loadTags();
    this.collectionsApiFacade.loadCollections();
    this.populateForm(this.item());
  }

  protected setTitle(event: Event): void {
    this.title.set(this.inputValue(event));
  }

  protected setCreator(event: Event): void {
    this.creator.set(this.inputValue(event));
  }

  protected setCategory(event: Event): void {
    const category = this.inputValue(event) as category;

    this.category.set(category);

    if (category !== 'books') {
      this.currentPage.set(undefined);
      this.totalPages.set(undefined);
    }
  }

  protected setStatusMode(event: Event): void {
    this.statusMode.set(this.inputValue(event) as 'wantToStart' | 'inProgress' | 'completed');
  }

  protected setRating(event: Event): void {
    this.rating.set(this.numberValue(event));
  }

  protected setProgress(event: Event): void {
    this.progress.set(this.numberValue(event));
  }

  protected setCurrentPage(event: Event): void {
    this.currentPage.set(this.optionalNumberValue(event));
    this.syncProgressFromPages();
  }

  protected setTotalPages(event: Event): void {
    this.totalPages.set(this.optionalNumberValue(event));
    this.syncProgressFromPages();
  }

  protected toggleTag(tagName: string): void {
    this.selectedTagNames.update((tagNames) =>
      tagNames.includes(tagName)
        ? tagNames.filter((selectedTagName) => selectedTagName !== tagName)
        : [...tagNames, tagName],
    );
  }

  protected isTagSelected(tagName: string): boolean {
    return this.selectedTagNames().includes(tagName);
  }

  protected toggleCollection(collectionId: string): void {
    this.selectedCollectionIds.update((collectionIds) =>
      collectionIds.includes(collectionId)
        ? collectionIds.filter((selectedCollectionId) => selectedCollectionId !== collectionId)
        : [...collectionIds, collectionId],
    );
  }

  protected isCollectionSelected(collectionId: string): boolean {
    return this.selectedCollectionIds().includes(collectionId);
  }

  protected setNote(event: Event): void {
    this.note.set(this.inputValue(event));
  }

  protected setImageUrl(event: Event): void {
    this.imageUrl.set(this.inputValue(event));
  }

  protected save(): void {
    const title = this.title().trim();

    if (!title) {
      return;
    }

    const category = this.category();
    const tags = this.tagNames();
    const normalizedImageUrl = this.normalizeImageUrl(this.imageUrl());
    const item: CreateItemPayload | Item = {
      ...(this.item() ? { id: this.item()?.id ?? '' } : {}),
      title,
      description: this.note().trim(),
      category,
      imageUrl: this.isLikelyImageUrl(normalizedImageUrl) ? normalizedImageUrl : this.fallbackImageUrl,
      sourceUrl:
        normalizedImageUrl && !this.isLikelyImageUrl(normalizedImageUrl)
          ? normalizedImageUrl
          : '',
      author: category === 'books' || category === 'music' || category === 'podcasts' ? this.creator().trim() : '',
      producer:
        category === 'movies' || category === 'series' || category === 'games' || category === 'audioBooks'
          ? this.creator().trim()
          : '',
      rating: this.rating(),
      status: this.statusFor(category, this.statusMode()),
      progress: this.itemProgress(category),
      currentPage: category === 'books' ? this.currentPage() : undefined,
      totalPages: category === 'books' ? this.totalPages() : undefined,
      tags,
      collectionIds: this.collectionIds(),
      note: this.note().trim(),
    };

    this.itemSave.emit(item);
    this.incrementAssignedTagCounts(tags);
    this.close();
  }

  protected isProgressCalculatedFromPages(): boolean {
    return this.category() === 'books' && this.progressFromPages() !== null;
  }

  private populateForm(item: Item | null): void {
    if (!item) {
      return;
    }

    this.title.set(item.title);
    this.creator.set(item.author || item.producer);
    this.category.set(item.category);
    this.statusMode.set(this.statusModeFor(item.status));
    this.rating.set(item.rating);
    this.progress.set(item.progress);
    this.currentPage.set(item.currentPage);
    this.totalPages.set(item.totalPages);
    this.selectedTagNames.set(item.tags ?? []);
    this.selectedCollectionIds.set(item.collectionIds ?? []);
    this.note.set(item.note || item.description);
    this.imageUrl.set(item.sourceUrl || item.imageUrl);
  }

  private incrementAssignedTagCounts(tags: string[]): void {
    const existingTagNames = new Set((this.item()?.tags ?? []).map((tag) => tag.toLowerCase()));
    const newlyAssignedTags = tags.filter((tag) => !existingTagNames.has(tag.toLowerCase()));
    const uniqueAssignedTagNames = new Set(newlyAssignedTags.map((tagName) => tagName.toLowerCase()));

    this.firebaseTags()
      .filter((tag) => uniqueAssignedTagNames.has(tag.name.toLowerCase()))
      .forEach((tag) => this.tagsApiFacade.incrementTagCount(tag.id));
  }

  protected close(): void {
    this.dialogClose.emit();
  }

  private tagNames(): string[] {
    const existingTagNames = new Set(this.firebaseTags().map((tag) => tag.name));

    return [
      ...new Set(
        this.selectedTagNames()
          .map((tagName) => tagName.trim())
          .filter((tagName) => tagName && existingTagNames.has(tagName)),
      ),
    ];
  }

  private collectionIds(): string[] {
    const existingCollectionIds = new Set([
      ...this.collections().map((collection) => collection.id),
      ...(this.item()?.collectionIds ?? []),
    ]);

    return [
      ...new Set(
        this.selectedCollectionIds().filter((collectionId) =>
          existingCollectionIds.has(collectionId),
        ),
      ),
    ];
  }

  private inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

  private normalizeImageUrl(imageUrl: string): string {
    const trimmedImageUrl = imageUrl.trim();

    if (!trimmedImageUrl) {
      return '';
    }

    if (trimmedImageUrl.startsWith('/') || /^https?:\/\//i.test(trimmedImageUrl)) {
      return trimmedImageUrl;
    }

    return `https://${trimmedImageUrl}`;
  }

  private isLikelyImageUrl(imageUrl: string): boolean {
    if (!imageUrl) {
      return false;
    }

    if (imageUrl.startsWith('/')) {
      return true;
    }

    try {
      const url = new URL(imageUrl);
      return /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname);
    } catch {
      return false;
    }
  }

  private numberValue(event: Event): number {
    return Number(this.inputValue(event)) || 0;
  }

  private optionalNumberValue(event: Event): number | undefined {
    const value = this.inputValue(event);

    return value ? Number(value) : undefined;
  }

  private syncProgressFromPages(): void {
    const progress = this.progressFromPages();

    if (progress === null) {
      return;
    }

    this.progress.set(progress);
  }

  private itemProgress(category: category): number {
    if (category !== 'books') {
      return this.progress();
    }

    return this.progressFromPages() ?? this.progress();
  }

  private progressFromPages(): number | null {
    const currentPage = this.currentPage();
    const totalPages = this.totalPages();

    if (currentPage === undefined || totalPages === undefined || totalPages <= 0) {
      return null;
    }

    return Math.min(Math.round((Math.max(currentPage, 0) / totalPages) * 100), 100);
  }

  private statusFor(
    category: category,
    statusMode: 'wantToStart' | 'inProgress' | 'completed',
  ): status {
    const statuses = {
      books: {
        wantToStart: 'wantToRead',
        inProgress: 'reading',
        completed: 'read',
      },
      movies: {
        wantToStart: 'wantToWatch',
        inProgress: 'watching',
        completed: 'watched',
      },
      series: {
        wantToStart: 'wantToWatch',
        inProgress: 'watching',
        completed: 'watched',
      },
      games: {
        wantToStart: 'wantToPlay',
        inProgress: 'playing',
        completed: 'played',
      },
      music: {
        wantToStart: 'wantToListen',
        inProgress: 'listening',
        completed: 'listened',
      },
      podcasts: {
        wantToStart: 'wantToListen',
        inProgress: 'listening',
        completed: 'listened',
      },
      audioBooks: {
        wantToStart: 'wantToListen',
        inProgress: 'listening',
        completed: 'listened',
      },
    } satisfies Record<category, Record<'wantToStart' | 'inProgress' | 'completed', status>>;

    return statuses[category][statusMode];
  }

  private statusModeFor(itemStatus: status): 'wantToStart' | 'inProgress' | 'completed' {
    if (['watched', 'read', 'played', 'listened'].includes(itemStatus)) {
      return 'completed';
    }

    if (['watching', 'reading', 'playing', 'listening'].includes(itemStatus)) {
      return 'inProgress';
    }

    return 'wantToStart';
  }
}
