import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { LibraryApiFacade } from '@features/library/state/library-api';
import type { category, Item, status } from '@features/library/types/item.types';
import { ReadingLogApiFacade } from '@features/reading-log/state/reading-log-api';
import type {
  ReadingLogEntry,
  ReadingLogPeriod,
} from '@features/reading-log/types/reading-log.types';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-stats',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [PageHeaderComponent, TranslatePipe],
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit {
  private readonly libraryApiFacade = inject(LibraryApiFacade);
  private readonly readingLogApiFacade = inject(ReadingLogApiFacade);

  protected readonly items = this.libraryApiFacade.allItems;
  protected readonly readingLogs = this.readingLogApiFacade.logs;
  protected readonly selectedPeriod = signal<ReadingLogPeriod>('month');
  protected readonly completedItems = computed(() =>
    this.items().filter((item) => this.isCompleted(item.status)),
  );
  protected readonly inProgressItems = computed(() =>
    this.items().filter((item) => this.isInProgress(item.status)),
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
  protected readonly estimatedHours = computed(() =>
    Math.round(
      this.items().reduce((total, item) => total + this.estimatedItemHours(item), 0),
    ),
  );
  protected readonly pagesRead = computed(() =>
    this.readingLogs().reduce((total, log) => total + log.pages, 0),
  );
  protected readonly readingHours = computed(() =>
    this.minutesToHours(
      this.readingLogs()
        .filter((log) => log.mode === 'reading')
        .reduce((total, log) => total + log.minutes, 0),
    ),
  );
  protected readonly listeningHours = computed(() =>
    this.minutesToHours(
      this.readingLogs()
        .filter((log) => log.mode === 'listening')
        .reduce((total, log) => total + log.minutes, 0),
    ),
  );
  protected readonly typeStats = computed(() => {
    const counts = this.categoryOptions.map((categoryOption) => ({
      ...categoryOption,
      count: this.items().filter((item) => item.category === categoryOption.id).length,
    }));
    const maxCount = Math.max(...counts.map((item) => item.count), 1);

    return counts.filter((item) => item.count > 0).map((item) => ({
      ...item,
      percentage: Math.round((item.count / maxCount) * 100),
    }));
  });
  protected readonly ratingStats = computed(() => {
    const counts = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: this.items().filter((item) => Math.round(item.rating) === rating).length,
    }));
    const maxCount = Math.max(...counts.map((item) => item.count), 1);

    return counts.map((item) => ({
      ...item,
      percentage: Math.round((item.count / maxCount) * 100),
    }));
  });
  protected readonly monthlyActivity = computed(() => {
    const months = this.lastTwelveMonths();
    const counts = months.map((month) => ({
      ...month,
      count: this.items().filter((item) => this.itemMonthKey(item) === month.key).length,
    }));
    const maxCount = Math.max(...counts.map((item) => item.count), 1);

    return counts.map((item) => ({
      ...item,
      percentage: Math.max(Math.round((item.count / maxCount) * 100), item.count > 0 ? 8 : 0),
    }));
  });
  protected readonly periodActivity = computed(() => {
    const buckets = this.periodBuckets(this.selectedPeriod());
    const bucketStats = buckets.map((bucket) => {
      const logs = this.readingLogs().filter(
        (log) => this.logPeriodKey(log, this.selectedPeriod()) === bucket.key,
      );
      const readingMinutes = logs
        .filter((log) => log.mode === 'reading')
        .reduce((total, log) => total + log.minutes, 0);
      const listeningMinutes = logs
        .filter((log) => log.mode === 'listening')
        .reduce((total, log) => total + log.minutes, 0);
      const pages = logs.reduce((total, log) => total + log.pages, 0);

      return {
        ...bucket,
        pages,
        readingHours: this.minutesToHours(readingMinutes),
        listeningHours: this.minutesToHours(listeningMinutes),
        readingMinutes,
        listeningMinutes,
      };
    });
    const maxPages = Math.max(...bucketStats.map((bucket) => bucket.pages), 1);
    const maxReadingMinutes = Math.max(...bucketStats.map((bucket) => bucket.readingMinutes), 1);
    const maxListeningMinutes = Math.max(
      ...bucketStats.map((bucket) => bucket.listeningMinutes),
      1,
    );

    return bucketStats.map((bucket) => ({
      ...bucket,
      pagePercentage: this.barPercentage(bucket.pages, maxPages),
      readingPercentage: this.barPercentage(bucket.readingMinutes, maxReadingMinutes),
      listeningPercentage: this.barPercentage(bucket.listeningMinutes, maxListeningMinutes),
    }));
  });

  protected readonly periodOptions = [
    { id: 'week', labelKey: 'stats.readingLog.periods.week' },
    { id: 'month', labelKey: 'stats.readingLog.periods.month' },
    { id: 'year', labelKey: 'stats.readingLog.periods.year' },
  ] as const satisfies ReadonlyArray<{ id: ReadingLogPeriod; labelKey: string }>;

  private readonly categoryOptions = [
    { id: 'books', labelKey: 'stats.categories.books' },
    { id: 'series', labelKey: 'stats.categories.series' },
    { id: 'games', labelKey: 'stats.categories.games' },
    { id: 'music', labelKey: 'stats.categories.music' },
    { id: 'movies', labelKey: 'stats.categories.movies' },
    { id: 'podcasts', labelKey: 'stats.categories.podcasts' },
    { id: 'audioBooks', labelKey: 'stats.categories.audioBooks' },
  ] as const satisfies ReadonlyArray<{ id: category; labelKey: string }>;

  ngOnInit(): void {
    this.libraryApiFacade.loadItems();
    this.readingLogApiFacade.loadReadingLogs();
  }

  protected selectPeriod(period: ReadingLogPeriod): void {
    this.selectedPeriod.set(period);
  }

  protected formatHours(hours: number): string {
    return hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
  }

  private estimatedItemHours(item: Item): number {
    if (item.category === 'books' || item.category === 'audioBooks') {
      return item.totalPages ? item.totalPages / 35 : 8;
    }

    if (item.category === 'series') {
      return 10;
    }

    if (item.category === 'games') {
      return 20;
    }

    if (item.category === 'music' || item.category === 'podcasts') {
      return 1;
    }

    return 2;
  }

  private itemMonthKey(item: Item): string {
    const timestamp = item.createdAt ?? item.updatedAt;
    const date = timestamp ? new Date(timestamp) : new Date();

    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  private lastTwelveMonths(): Array<{ key: string; label: string }> {
    const date = new Date();

    return Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(date.getFullYear(), date.getMonth() - (11 - index), 1);

      return {
        key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
        label: new Intl.DateTimeFormat('en', { month: 'short' }).format(monthDate),
      };
    });
  }

  private periodBuckets(period: ReadingLogPeriod): Array<{ key: string; label: string }> {
    const date = new Date();

    if (period === 'week') {
      return Array.from({ length: 7 }, (_, index) => {
        const dayDate = new Date(date);
        dayDate.setDate(date.getDate() - (6 - index));

        return {
          key: this.dateKey(dayDate),
          label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(dayDate),
        };
      });
    }

    if (period === 'year') {
      return Array.from({ length: 5 }, (_, index) => {
        const year = date.getFullYear() - (4 - index);

        return {
          key: `${year}`,
          label: `${year}`,
        };
      });
    }

    return this.lastTwelveMonths();
  }

  private logPeriodKey(log: ReadingLogEntry, period: ReadingLogPeriod): string {
    const date = new Date(log.startedAt);

    if (period === 'week') {
      return this.dateKey(date);
    }

    if (period === 'year') {
      return `${date.getFullYear()}`;
    }

    return `${date.getFullYear()}-${date.getMonth()}`;
  }

  private dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private minutesToHours(minutes: number): number {
    return Math.round((minutes / 60) * 10) / 10;
  }

  private barPercentage(value: number, max: number): number {
    return Math.max(Math.round((value / max) * 100), value > 0 ? 8 : 0);
  }

  private isCompleted(itemStatus: status): boolean {
    return ['watched', 'read', 'played', 'listened'].includes(itemStatus);
  }

  private isInProgress(itemStatus: status): boolean {
    return ['watching', 'reading', 'playing', 'listening'].includes(itemStatus);
  }
}
