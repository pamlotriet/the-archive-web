import { Component, computed, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/button/button';
import { InputComponent } from '@app/shared/components/input/input';
import { TranslatePipe } from '@ngx-translate/core';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { NewEntryDialogComponent } from '../../components/new-entry-dialog/new-entry-dialog.component';
import type { Item } from '../../types/item.types';

@Component({
  selector: 'app-library',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [
    TranslatePipe,
    ButtonComponent,
    InputComponent,
    ItemCardComponent,
    NewEntryDialogComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css',
})
export class LibraryComponent {
  protected readonly viewMode = signal<'grid' | 'list'>('grid');
  protected readonly isNewEntryOpen = signal(false);
  protected readonly items: Item[] = [
    {
      id: 'book-dune',
      title: 'Dune',
      description: 'A desert planet, a dangerous inheritance, and a family caught inside empire.',
      category: 'books',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/0441172717-L.jpg',
      author: 'Frank Herbert',
      producer: '',
      rating: 5,
      status: 'reading',
      progress: 62,
      currentPage: 555,
      totalPages: 896,
    },
    {
      id: 'movie-arrival',
      title: 'Arrival',
      description: 'A linguist works to understand visitors whose language bends time.',
      category: 'movies',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg',
      author: '',
      producer: 'Denis Villeneuve',
      rating: 5,
      status: 'watched',
      progress: 100,
    },
    {
      id: 'series-severance',
      title: 'Severance',
      description:
        'A workplace mystery about memory, identity, and the cost of compartmentalizing.',
      category: 'series',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Severance_logo.svg/500px-Severance_logo.svg.png',
      author: '',
      producer: 'Ben Stiller',
      rating: 4,
      status: 'watching',
      progress: 48,
    },
    {
      id: 'game-hades',
      title: 'Hades',
      description: 'A sharp, stylish roguelike escape through the underworld.',
      category: 'games',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
      author: '',
      producer: 'Supergiant Games',
      rating: 5,
      status: 'playing',
      progress: 74,
    },
    {
      id: 'music-blonde',
      title: 'Blonde',
      description: 'A layered album for late-night listening and long walks.',
      category: 'music',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg',
      author: 'Frank Ocean',
      producer: '',
      rating: 5,
      status: 'listened',
      progress: 100,
    },
    {
      id: 'podcast-articles-of-interest',
      title: 'Articles of Interest',
      description: 'Stories about what we wear and the culture stitched into it.',
      category: 'podcasts',
      imageUrl:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80',
      author: 'Avery Trufelman',
      producer: '',
      rating: 4,
      status: 'listening',
      progress: 35,
    },
    {
      id: 'audiobook-project-hail-mary',
      title: 'Project Hail Mary',
      description: 'A lone scientist wakes up far from home with a planet to save.',
      category: 'audioBooks',
      imageUrl: 'https://covers.openlibrary.org/b/isbn/9780593395561-L.jpg',
      author: 'Andy Weir',
      producer: 'Ray Porter',
      rating: 4,
      status: 'wantToListen',
      progress: 0,
    },
  ];

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

  protected get filteredItems(): Item[] {
    const selectedCategory = this.selectedCategory();

    if (selectedCategory === 'all') {
      return this.items;
    }

    return this.items.filter((item) => item.category === selectedCategory);
  }

  protected get entriesAmount(): number {
    return this.filteredItems.length;
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  protected selectCategory(category: CategoryId): void {
    this.selectedCategory.set(category);
  }

  protected openNewEntry(): void {
    this.isNewEntryOpen.set(true);
  }

  protected closeNewEntry(): void {
    this.isNewEntryOpen.set(false);
  }
}

type CategoryId = LibraryComponent['categories'][number]['id'];
