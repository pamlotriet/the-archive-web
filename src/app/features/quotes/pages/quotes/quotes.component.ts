import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/button/button';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { LibraryApiFacade } from '../../../library/state/library-api';
import type { Item } from '../../../library/types/item.types';
import { QuotesApiFacade } from '../../state/quotes-api';
import type { CreateQuotePayload, Quote, UpdateQuotePayload } from '../../types/quote.types';

@Component({
  selector: 'app-quotes',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [ButtonComponent, PIcon, TranslatePipe],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css',
})
export class QuotesComponent implements OnInit {
  private readonly quotesApiFacade = inject(QuotesApiFacade);
  private readonly libraryApiFacade = inject(LibraryApiFacade);

  protected readonly quotes = this.quotesApiFacade.quotes;
  protected readonly items = this.libraryApiFacade.allItems;
  protected readonly loading = this.quotesApiFacade.loading;
  protected readonly error = this.quotesApiFacade.error;
  protected readonly searchTerm = signal('');
  protected readonly favoritesOnly = signal(false);
  protected readonly isDialogOpen = signal(false);
  protected readonly editingQuote = signal<Quote | null>(null);
  protected readonly text = signal('');
  protected readonly author = signal('');
  protected readonly source = signal('');
  protected readonly itemId = signal('');
  protected readonly note = signal('');
  protected readonly favorite = signal(false);

  protected readonly filteredQuotes = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();

    return this.quotes().filter((quote) => {
      const linkedItem = this.linkedItem(quote.itemId);
      const searchableText = [
        quote.text,
        quote.author,
        quote.source,
        quote.note,
        linkedItem?.title,
        linkedItem?.author,
        linkedItem?.producer,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        (!this.favoritesOnly() || quote.favorite) &&
        (!searchTerm || searchableText.includes(searchTerm))
      );
    });
  });

  ngOnInit(): void {
    this.quotesApiFacade.loadQuotes();
    this.libraryApiFacade.loadItems();
  }

  protected openNewQuote(): void {
    this.editingQuote.set(null);
    this.text.set('');
    this.author.set('');
    this.source.set('');
    this.itemId.set('');
    this.note.set('');
    this.favorite.set(false);
    this.isDialogOpen.set(true);
  }

  protected editQuote(quote: Quote): void {
    this.editingQuote.set(quote);
    this.text.set(quote.text);
    this.author.set(quote.author);
    this.source.set(quote.source);
    this.itemId.set(quote.itemId ?? '');
    this.note.set(quote.note ?? '');
    this.favorite.set(quote.favorite);
    this.isDialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingQuote.set(null);
  }

  protected setSearchTerm(event: Event): void {
    this.searchTerm.set(this.inputValue(event));
  }

  protected toggleFavoritesOnly(): void {
    this.favoritesOnly.update((value) => !value);
  }

  protected setText(event: Event): void {
    this.text.set(this.inputValue(event));
  }

  protected setAuthor(event: Event): void {
    this.author.set(this.inputValue(event));
  }

  protected setSource(event: Event): void {
    this.source.set(this.inputValue(event));
  }

  protected setNote(event: Event): void {
    this.note.set(this.inputValue(event));
  }

  protected selectItem(event: Event): void {
    const itemId = this.inputValue(event);
    const item = this.linkedItem(itemId);

    this.itemId.set(itemId);

    if (item && !this.source().trim()) {
      this.source.set(item.title);
    }

    if (item && !this.author().trim()) {
      this.author.set(this.itemCreator(item));
    }
  }

  protected toggleFavorite(): void {
    this.favorite.update((value) => !value);
  }

  protected toggleQuoteFavorite(quote: Quote): void {
    this.quotesApiFacade.updateQuote({
      id: quote.id,
      favorite: !quote.favorite,
    });
  }

  protected saveQuote(): void {
    const text = this.text().trim();

    if (!text) {
      return;
    }

    const quote: CreateQuotePayload = {
      text,
      author: this.author().trim(),
      source: this.source().trim(),
      itemId: this.itemId(),
      note: this.note().trim(),
      favorite: this.favorite(),
    };
    const editingQuote = this.editingQuote();

    if (editingQuote) {
      this.quotesApiFacade.updateQuote({ id: editingQuote.id, ...quote } satisfies UpdateQuotePayload);
    } else {
      this.quotesApiFacade.addQuote(quote);
    }

    this.closeDialog();
  }

  protected deleteQuote(id: string): void {
    this.quotesApiFacade.deleteQuote(id);
  }

  protected linkedItem(itemId: string | undefined): Item | undefined {
    return itemId ? this.items().find((item) => item.id === itemId) : undefined;
  }

  protected itemCreator(item: Item): string {
    return item.author || item.producer || 'Unknown creator';
  }

  private inputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }
}
