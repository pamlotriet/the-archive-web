import { Component, EventEmitter, Input, OnDestroy, Output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import type { Item } from '@features/library/types/item.types';

@Component({
  selector: 'app-tbr-wheel-dialog',
  imports: [PIcon, TranslatePipe],
  templateUrl: './tbr-wheel-dialog.component.html',
})
export class TbrWheelDialogComponent implements OnDestroy {
  @Input({ required: true }) items: Item[] = [];
  @Output() readonly dialogClose = new EventEmitter<void>();

  protected readonly rotation = signal(0);
  protected readonly isSpinning = signal(false);
  protected readonly selectedBook = signal<Item | null>(null);

  private selectionTimer: ReturnType<typeof setTimeout> | null = null;
  protected readonly colors = ['#dca945', '#8b5cf6', '#0ea5e9', '#11b981', '#f97316', '#ec4899'];

  protected get tbrBooks(): Item[] {
    return this.items.filter((item) => item.category === 'books' && item.status === 'wantToRead');
  }

  protected get wheelStyle(): Record<string, string> {
    const books = this.tbrBooks;

    if (books.length === 0) {
      return { background: '#1e293b' };
    }

    const segmentSize = 100 / books.length;
    const segments = books.map((_, index) => {
      const start = index * segmentSize;
      const end = (index + 1) * segmentSize;
      return `${this.colors[index % this.colors.length]} ${start}% ${end}%`;
    });

    return {
      background: `conic-gradient(${segments.join(', ')})`,
      transform: `rotate(${this.rotation()}deg)`,
    };
  }

  protected wheelLabelStyle(index: number): Record<string, string> {
    const segmentAngle = 360 / this.tbrBooks.length;
    const angle = index * segmentAngle + segmentAngle / 2 - 90;

    return {
      transform: `translateY(-50%) rotate(${angle}deg)`,
    };
  }

  ngOnDestroy(): void {
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
    }
  }

  protected spin(): void {
    const books = this.tbrBooks;

    if (books.length === 0 || this.isSpinning()) {
      return;
    }

    const selectedIndex = Math.floor(Math.random() * books.length);
    const segmentAngle = 360 / books.length;
    const selectedCenter = selectedIndex * segmentAngle + segmentAngle / 2;
    const currentAngle = this.rotation() % 360;
    const alignment = (360 - selectedCenter - currentAngle + 360) % 360;

    this.selectedBook.set(null);
    this.isSpinning.set(true);
    this.rotation.update((rotation) => rotation + 5 * 360 + alignment);
    this.selectionTimer = setTimeout(() => {
      this.selectedBook.set(books[selectedIndex]);
      this.isSpinning.set(false);
      this.selectionTimer = null;
    }, 3200);
  }

  protected close(): void {
    if (!this.isSpinning()) {
      this.dialogClose.emit();
    }
  }
}
