import { Component, computed, inject, input, OnDestroy, output, signal } from '@angular/core';
import { DialogShellComponent } from '@shared/components/dialog-shell/dialog-shell.component';
import { eventNumber, eventValue } from '@shared/utils/form-event';
import { ReadingLogApiFacade } from '@features/reading-log/state/reading-log-api';
import type { ReadingLogMode } from '@features/reading-log/types/reading-log.types';
import { TranslatePipe } from '@ngx-translate/core';
import type { Item } from '@features/library/types/item.types';

@Component({
  selector: 'app-reading-log-dialog',
  imports: [DialogShellComponent, TranslatePipe],
  templateUrl: './reading-log-dialog.component.html',
})
export class ReadingLogDialogComponent implements OnDestroy {
  private readonly readingLogApiFacade = inject(ReadingLogApiFacade);

  readonly items = input.required<Item[]>();
  readonly dialogClose = output<void>();
  readonly pagesLogged = output<{ item: Item; pages: number }>();

  protected readonly logItemId = signal('');
  protected readonly logMode = signal<ReadingLogMode>('reading');
  protected readonly logPages = signal(0);
  protected readonly logMinutes = signal(0);
  protected readonly logNote = signal('');
  protected readonly timerStartedAt = signal<number | null>(null);
  protected readonly elapsedSeconds = signal(0);

  protected readonly loggableItems = computed(() =>
    this.items().filter((item) => this.canLogSession(item)),
  );
  protected readonly selectedLogItem = computed(() => {
    const selectedId = this.logItemId() || this.loggableItems()[0]?.id;

    return this.loggableItems().find((item) => item.id === selectedId) ?? null;
  });
  protected readonly timerLabel = computed(() => this.formatSeconds(this.elapsedSeconds()));
  protected readonly canSaveReadingLog = computed(() => {
    const item = this.selectedLogItem();

    return Boolean(item) && (this.logPages() > 0 || this.currentLogMinutes() > 0);
  });

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnDestroy(): void {
    this.stopTimerInterval();
  }

  protected close(): void {
    this.stopTimer();
    this.resetForm();
    this.dialogClose.emit();
  }

  protected setLogItem(event: Event): void {
    const itemId = eventValue(event);
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
    this.logPages.set(Math.max(eventNumber(event), 0));
  }

  protected setLogMinutes(event: Event): void {
    this.logMinutes.set(Math.max(eventNumber(event), 0));
  }

  protected setLogNote(event: Event): void {
    this.logNote.set(eventValue(event));
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
      this.pagesLogged.emit({ item, pages });
    }

    this.close();
  }

  protected shouldShowPageLogging(item: Item | null): boolean {
    return item?.category === 'books' && this.logMode() === 'reading';
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

  private resetForm(): void {
    this.logItemId.set('');
    this.logMode.set('reading');
    this.logPages.set(0);
    this.logMinutes.set(0);
    this.logNote.set('');
    this.resetTimer();
  }

  private formatSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => value.toString().padStart(2, '0')).join(':');
  }

  private stopTimerInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
