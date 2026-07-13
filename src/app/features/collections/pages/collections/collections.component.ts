import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@app/shared/components/button/button';
import { eventValue } from '@app/shared/utils/form-event';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { LibraryApiFacade } from '../../../library/state/library-api';
import type { Item } from '../../../library/types/item.types';
import { CollectionsApiFacade } from '../../state/collections-api';
import type {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../../types/collection.types';

@Component({
  selector: 'app-collections',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [ButtonComponent, PIcon, TranslatePipe],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css',
})
export class CollectionsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionsApiFacade = inject(CollectionsApiFacade);
  private readonly libraryApiFacade = inject(LibraryApiFacade);

  protected readonly collections = this.collectionsApiFacade.collections;
  protected readonly items = this.libraryApiFacade.allItems;
  protected readonly loading = this.collectionsApiFacade.loading;
  protected readonly error = this.collectionsApiFacade.error;
  protected readonly isDialogOpen = signal(false);
  protected readonly editingCollection = signal<Collection | null>(null);
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly color = signal('#dca945');
  protected readonly selectedCollectionId = signal<string | null>(null);
  protected readonly itemSearchTerm = signal('');

  protected readonly selectedCollection = computed(
    () =>
      this.collections().find((collection) => collection.id === this.selectedCollectionId()) ??
      null,
  );

  protected readonly assignedItems = computed(() => {
    const collectionId = this.selectedCollectionId();

    if (!collectionId) {
      return [];
    }

    return this.items().filter((item) => item.collectionIds?.includes(collectionId));
  });

  protected readonly availableItems = computed(() => {
    const collectionId = this.selectedCollectionId();
    const searchTerm = this.itemSearchTerm().trim().toLowerCase();

    if (!collectionId) {
      return [];
    }

    return this.items().filter((item) => {
      const isAlreadyAssigned = item.collectionIds?.includes(collectionId);
      const creator = item.author || item.producer;
      const matchesSearch =
        !searchTerm ||
        [item.title, creator, item.description, item.note, ...(item.tags ?? [])]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm);

      return !isAlreadyAssigned && matchesSearch;
    });
  });

  protected readonly totalAssignedItems = computed(() =>
    this.collections().reduce(
      (total, collection) => total + this.collectionItemCount(collection.id),
      0,
    ),
  );

  protected readonly colorPresets = [
    '#dca945',
    '#ef4444',
    '#f97316',
    '#14b8a6',
    '#0ea5e9',
    '#6366f1',
    '#8b5cf6',
    '#22c55e',
  ];

  ngOnInit(): void {
    this.collectionsApiFacade.loadCollections();
    this.libraryApiFacade.loadItems();
    this.selectedCollectionId.set(this.activatedRoute.snapshot.paramMap.get('collectionId'));
  }

  protected openNewCollection(): void {
    this.editingCollection.set(null);
    this.name.set('');
    this.description.set('');
    this.color.set('#dca945');
    this.isDialogOpen.set(true);
  }

  protected editCollection(collection: Collection): void {
    this.editingCollection.set(collection);
    this.name.set(collection.name);
    this.description.set(collection.description);
    this.color.set(collection.color);
    this.isDialogOpen.set(true);
  }

  protected deleteCollection(collectionId: string): void {
    this.collectionsApiFacade.deleteCollection(collectionId);

    if (this.selectedCollectionId() === collectionId) {
      this.backToCollections();
    }
  }

  protected openCollection(collectionId: string): void {
    this.selectedCollectionId.set(collectionId);
    this.itemSearchTerm.set('');
    this.router.navigate(['/collections', collectionId]);
  }

  protected backToCollections(): void {
    this.selectedCollectionId.set(null);
    this.itemSearchTerm.set('');
    this.router.navigate(['/collections']);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingCollection.set(null);
  }

  protected setName(event: Event): void {
    this.name.set(eventValue(event));
  }

  protected setDescription(event: Event): void {
    this.description.set(eventValue(event));
  }

  protected setColor(event: Event): void {
    this.color.set(eventValue(event));
  }

  protected setItemSearchTerm(event: Event): void {
    this.itemSearchTerm.set(eventValue(event));
  }

  protected selectColor(color: string): void {
    this.color.set(color);
  }

  protected saveCollection(): void {
    const name = this.name().trim();

    if (!name) {
      return;
    }

    const collection: CreateCollectionPayload = {
      name,
      description: this.description().trim(),
      color: this.color(),
    };
    const editingCollection = this.editingCollection();

    if (editingCollection) {
      this.collectionsApiFacade.updateCollection({
        id: editingCollection.id,
        ...collection,
      } satisfies UpdateCollectionPayload);
    } else {
      this.collectionsApiFacade.addCollection(collection);
    }

    this.closeDialog();
  }

  protected collectionItemCount(collectionId: string): number {
    return this.items().filter((item) => item.collectionIds?.includes(collectionId)).length;
  }

  protected itemCreator(item: Item): string {
    return item.author || item.producer || 'Unknown creator';
  }

  protected addItemToSelectedCollection(item: Item): void {
    const collectionId = this.selectedCollectionId();

    if (!collectionId) {
      return;
    }

    this.updateItemCollections(item, [
      ...new Set([...(item.collectionIds ?? []), collectionId]),
    ]);
  }

  protected removeItemFromSelectedCollection(item: Item): void {
    const collectionId = this.selectedCollectionId();

    if (!collectionId) {
      return;
    }

    this.updateItemCollections(
      item,
      (item.collectionIds ?? []).filter((itemCollectionId) => itemCollectionId !== collectionId),
    );
  }

  private updateItemCollections(item: Item, collectionIds: string[]): void {
    this.libraryApiFacade.updateItem({
      id: item.id,
      collectionIds,
    });
  }
}
