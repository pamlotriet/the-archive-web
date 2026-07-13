import { Component, input, output, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';
import type { Item } from '../../types/item.types';
import type { category, status } from '../../types/item.types';

@Component({
  selector: 'app-item-card',
  host: {
    class: 'block',
  },
  imports: [PIcon],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
})
export class ItemCardComponent {
  private readonly fallbackImageUrl = '/assets/images/library-login-background.png';

  item = input<Item>();
  viewMode = input<'grid' | 'list'>('grid');
  readonly itemEdit = output<Item>();
  readonly itemDelete = output<string>();
  protected readonly isActionsOpen = signal(false);

  protected categoryLabel(category: category): string {
    const labels = {
      books: 'BOOK',
      movies: 'MOVIE',
      series: 'SERIES',
      games: 'GAME',
      music: 'MUSIC',
      podcasts: 'PODCAST',
      audioBooks: 'AUDIOBOOK',
    } satisfies Record<category, string>;

    return labels[category];
  }

  protected categoryIcon(category: category): string {
    const icons = {
      books: 'book',
      movies: 'video',
      series: 'desktop',
      games: 'play-circle',
      music: 'volume-up',
      podcasts: 'microphone',
      audioBooks: 'headphones',
    } satisfies Record<category, string>;

    return icons[category];
  }

  protected creator(item: Item): string {
    return item.author || item.producer;
  }

  protected progressLabel(item: Item): string {
    if (item.category === 'books' && item.currentPage !== undefined && item.totalPages) {
      return `${item.progress}% · ${item.currentPage}/${item.totalPages} pages`;
    }

    return `${item.progress}%`;
  }

  protected imageSource(item: Item): string {
    return item.imageUrl || this.fallbackImageUrl;
  }

  protected initials(item: Item): string {
    return item.title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('');
  }

  protected thumbnailClass(category: category): string {
    const classes = {
      books: 'from-sky-500 to-slate-950',
      movies: 'from-red-400 to-orange-950',
      series: 'from-cyan-500 to-slate-950',
      games: 'from-orange-500 to-amber-950',
      music: 'from-lime-500 to-green-950',
      podcasts: 'from-violet-500 to-slate-950',
      audioBooks: 'from-blue-500 to-indigo-950',
    } satisfies Record<category, string>;

    return classes[category];
  }

  protected useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (image.src.endsWith(this.fallbackImageUrl)) {
      return;
    }

    image.src = this.fallbackImageUrl;
  }

  protected toggleActions(): void {
    this.isActionsOpen.update((isOpen) => !isOpen);
  }

  protected closeActions(): void {
    this.isActionsOpen.set(false);
  }

  protected editItem(item: Item): void {
    this.itemEdit.emit(item);
    this.closeActions();
  }

  protected deleteItem(item: Item): void {
    this.itemDelete.emit(item.id);
    this.closeActions();
  }

  protected statusLabel(status: status): string {
    if (this.isComplete(status)) {
      return 'COMPLETED';
    }

    if (this.isInProgress(status)) {
      return 'IN PROGRESS';
    }

    return 'WANT TO START';
  }

  protected rowStatusLabel(status: status): string {
    if (this.isComplete(status)) {
      return 'Completed';
    }

    if (this.isInProgress(status)) {
      return 'In progress';
    }

    return 'Want to start';
  }

  protected statusClass(status: status): string {
    if (this.isComplete(status)) {
      return 'bg-emerald-400 text-white';
    }

    if (this.isInProgress(status)) {
      return 'bg-[#e3b34c] text-slate-950';
    }

    return 'bg-slate-800 text-white';
  }

  private isComplete(status: status): boolean {
    return ['watched', 'read', 'played', 'listened'].includes(status);
  }

  private isInProgress(status: status): boolean {
    return ['watching', 'reading', 'playing', 'listening'].includes(status);
  }
}
