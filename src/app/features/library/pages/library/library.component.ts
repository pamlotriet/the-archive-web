import { Component, computed, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/button/button';
import { InputComponent } from '@app/shared/components/input/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-library',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [TranslatePipe, ButtonComponent, InputComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
})
export class LibraryComponent {
  protected entriesAmount = 0;
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

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

  protected readonly selectedCategory = signal<CategoryId>('all');
  protected readonly selectedCategoryContentKey = computed(
    () =>
      this.categories.find((category) => category.id === this.selectedCategory())?.contentKey ??
      'library.content.all',
  );

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  protected selectCategory(category: CategoryId): void {
    this.selectedCategory.set(category);
  }
}

type CategoryId = LibraryComponent['categories'][number]['id'];
