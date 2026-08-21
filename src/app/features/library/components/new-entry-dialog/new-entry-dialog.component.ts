import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { DialogShellComponent } from '@app/shared/components/dialog-shell/dialog-shell.component';
import { eventNumber, eventValue } from '@app/shared/utils/form-event';
import { TranslatePipe } from '@ngx-translate/core';
import { CollectionsApiFacade } from '../../../collections/state/collections-api';
import { TagsApiFacade } from '../../../tags/state/tags-api';
import type {
  BookFormat,
  BookOwnership,
  CreateItemPayload,
  Item,
  category,
  status,
} from '../../types/item.types';

@Component({
  selector: 'app-new-entry-dialog',
  imports: [DialogShellComponent, TranslatePipe],
  templateUrl: './new-entry-dialog.component.html',
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
  protected readonly genre = signal('');
  protected readonly format = signal<BookFormat>('paperback');
  protected readonly publicationDate = signal('');
  protected readonly isSeries = signal(false);
  protected readonly seriesBookNumber = signal<number | undefined>(undefined);
  protected readonly ownership = signal<BookOwnership>('owned');
  protected readonly audiobookHours = signal<number | undefined>(undefined);
  protected readonly spiceRating = signal(0);
  protected readonly isFavourite = signal(false);
  protected readonly wouldRecommend = signal(false);
  protected readonly wouldReread = signal(false);
  protected readonly yearRead = signal<number | undefined>(undefined);
  protected readonly startDate = signal('');
  protected readonly endDate = signal('');
  protected readonly selectedTagNames = signal<string[]>([]);
  protected readonly selectedCollectionIds = signal<string[]>([]);
  protected readonly note = signal('');
  protected readonly imageUrl = signal('');
  protected readonly firebaseTags = this.tagsApiFacade.tags;
  protected readonly collections = this.collectionsApiFacade.collections;

  private readonly populateFormOnEdit = effect(() => {
    this.populateForm(this.item());
  });

  protected readonly entryTypes = [
    { id: 'books', labelKey: 'library.newEntry.types.books' },
    { id: 'movies', labelKey: 'library.newEntry.types.movies' },
    { id: 'series', labelKey: 'library.newEntry.types.series' },
    { id: 'games', labelKey: 'library.newEntry.types.games' },
    { id: 'music', labelKey: 'library.newEntry.types.music' },
    { id: 'podcasts', labelKey: 'library.newEntry.types.podcasts' },
  ] as const satisfies ReadonlyArray<{ id: category; labelKey: string }>;

  protected readonly formats = [
    { id: 'paperback', labelKey: 'library.newEntry.formats.paperback' },
    { id: 'hardcover', labelKey: 'library.newEntry.formats.hardcover' },
    { id: 'ebook', labelKey: 'library.newEntry.formats.ebook' },
    { id: 'audiobook', labelKey: 'library.newEntry.formats.audiobook' },
  ] as const satisfies ReadonlyArray<{ id: string; labelKey: string }>;

  protected readonly ownershipOptions = [
    { id: 'owned', labelKey: 'library.newEntry.ownership.owned' },
    { id: 'borrowed', labelKey: 'library.newEntry.ownership.borrowed' },
    { id: 'library', labelKey: 'library.newEntry.ownership.library' },
    { id: 'digitalSubscription', labelKey: 'library.newEntry.ownership.digitalSubscription' },
  ] as const satisfies ReadonlyArray<{ id: BookOwnership; labelKey: string }>;

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
  }

  protected setTitle(event: Event): void {
    this.title.set(eventValue(event));
  }

  protected setCreator(event: Event): void {
    this.creator.set(eventValue(event));
  }

  protected setCategory(event: Event): void {
    const category = eventValue(event) as category;

    this.category.set(category);

    if (category !== 'books') {
      this.currentPage.set(undefined);
      this.totalPages.set(undefined);
    }
  }

  protected setStatusMode(event: Event): void {
    this.statusMode.set(eventValue(event) as 'wantToStart' | 'inProgress' | 'completed');
  }

  protected setRating(event: Event): void {
    this.rating.set(eventNumber(event));
  }

  protected setProgress(event: Event): void {
    this.progress.set(eventNumber(event));
  }

  protected setCurrentPage(event: Event): void {
    this.currentPage.set(this.optionalNumberValue(event));
    this.syncProgressFromPages();
  }

  protected setTotalPages(event: Event): void {
    this.totalPages.set(this.optionalNumberValue(event));
    this.syncProgressFromPages();
  }

  protected setText(target: { set(value: string): void }, event: Event): void {
    target.set(eventValue(event));
  }

  protected setOptionalNumber(
    target: { set(value: number | undefined): void },
    event: Event,
  ): void {
    target.set(this.optionalNumberValue(event));
  }

  protected setFormat(event: Event): void {
    this.format.set(eventValue(event) as BookFormat);
    if (this.format() !== 'audiobook') this.audiobookHours.set(undefined);
  }

  protected setOwnership(event: Event): void {
    this.ownership.set(eventValue(event) as BookOwnership);
  }

  protected setBoolean(target: { set(value: boolean): void }, event: Event): void {
    target.set((event.target as HTMLInputElement).checked);
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
    this.note.set(eventValue(event));
  }

  protected setImageUrl(event: Event): void {
    this.imageUrl.set(eventValue(event));
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
      imageUrl: this.isLikelyImageUrl(normalizedImageUrl)
        ? normalizedImageUrl
        : this.fallbackImageUrl,
      sourceUrl:
        normalizedImageUrl && !this.isLikelyImageUrl(normalizedImageUrl) ? normalizedImageUrl : '',
      author:
        category === 'books' || category === 'music' || category === 'podcasts'
          ? this.creator().trim()
          : '',
      producer:
        category === 'movies' ||
        category === 'series' ||
        category === 'games' ||
        category === 'audioBooks'
          ? this.creator().trim()
          : '',
      rating: this.rating(),
      status: this.statusFor(category, this.statusMode()),
      progress: this.itemProgress(category),
      currentPage: category === 'books' ? this.currentPage() : undefined,
      totalPages: category === 'books' ? this.totalPages() : undefined,
      genre: category === 'books' ? this.genre().trim() : undefined,
      format: category === 'books' ? this.format() : undefined,
      publicationDate: category === 'books' ? this.publicationDate() : undefined,
      isSeries: category === 'books' ? this.isSeries() : undefined,
      seriesBookNumber:
        category === 'books' && this.isSeries() ? this.seriesBookNumber() : undefined,
      ownership: category === 'books' ? this.ownership() : undefined,
      audiobookHours:
        category === 'books' && this.format() === 'audiobook'
          ? this.audiobookHours()
          : undefined,
      spiceRating: category === 'books' ? this.spiceRating() : undefined,
      isFavourite: category === 'books' ? this.isFavourite() : undefined,
      wouldRecommend: category === 'books' ? this.wouldRecommend() : undefined,
      wouldReread: category === 'books' ? this.wouldReread() : undefined,
      yearRead: category === 'books' ? this.yearRead() : undefined,
      startDate: category === 'books' ? this.startDate() : undefined,
      endDate: category === 'books' ? this.endDate() : undefined,
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
    this.genre.set(item.genre ?? '');
    this.format.set(item.format ?? 'paperback');
    this.publicationDate.set(item.publicationDate ?? '');
    this.isSeries.set(item.isSeries ?? false);
    this.seriesBookNumber.set(item.seriesBookNumber);
    this.ownership.set(item.ownership ?? 'owned');
    this.audiobookHours.set(item.audiobookHours);
    this.spiceRating.set(item.spiceRating ?? 0);
    this.isFavourite.set(item.isFavourite ?? false);
    this.wouldRecommend.set(item.wouldRecommend ?? false);
    this.wouldReread.set(item.wouldReread ?? false);
    this.yearRead.set(item.yearRead);
    this.startDate.set(item.startDate ?? '');
    this.endDate.set(item.endDate ?? '');
    this.selectedTagNames.set(item.tags ?? []);
    this.selectedCollectionIds.set(item.collectionIds ?? []);
    this.note.set(item.note || item.description);
    this.imageUrl.set(item.sourceUrl || item.imageUrl);
  }

  private incrementAssignedTagCounts(tags: string[]): void {
    const existingTagNames = new Set((this.item()?.tags ?? []).map((tag) => tag.toLowerCase()));
    const newlyAssignedTags = tags.filter((tag) => !existingTagNames.has(tag.toLowerCase()));
    const uniqueAssignedTagNames = new Set(
      newlyAssignedTags.map((tagName) => tagName.toLowerCase()),
    );

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

  private optionalNumberValue(event: Event): number | undefined {
    const value = eventValue(event);

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
