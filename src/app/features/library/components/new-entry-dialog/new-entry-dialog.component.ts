import { Component, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import type { category, status } from '../../types/item.types';

@Component({
  selector: 'app-new-entry-dialog',
  imports: [PIcon, TranslatePipe],
  templateUrl: './new-entry-dialog.component.html',
  styleUrl: './new-entry-dialog.component.css',
})
export class NewEntryDialogComponent {
  readonly dialogClose = output<void>();

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
    { id: 'wantToRead', labelKey: 'library.newEntry.statuses.wantToStart' },
    { id: 'reading', labelKey: 'library.newEntry.statuses.inProgress' },
    { id: 'read', labelKey: 'library.newEntry.statuses.completed' },
  ] as const satisfies ReadonlyArray<{ id: status; labelKey: string }>;

  protected close(): void {
    this.dialogClose.emit();
  }
}
