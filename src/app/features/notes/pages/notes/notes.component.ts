import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { eventValue } from '@shared/utils/form-event';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { LibraryApiFacade } from '@features/library/state/library-api';
import type { Item } from '@features/library/types/item.types';
import { TagsApiFacade } from '@features/tags/state/tags-api';
import { NotesApiFacade } from '@features/notes/state/notes-api';
import type { CreateNotePayload, Note, UpdateNotePayload } from '@features/notes/types/note.types';

@Component({
  selector: 'app-notes',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [ButtonComponent, NgTemplateOutlet, PageHeaderComponent, PIcon, TranslatePipe],
  templateUrl: './notes.component.html',
})
export class NotesComponent implements OnInit {
  private readonly notesApiFacade = inject(NotesApiFacade);
  private readonly tagsApiFacade = inject(TagsApiFacade);
  private readonly libraryApiFacade = inject(LibraryApiFacade);

  protected readonly notes = this.notesApiFacade.notes;
  protected readonly tags = this.tagsApiFacade.tags;
  protected readonly items = this.libraryApiFacade.allItems;
  protected readonly loading = this.notesApiFacade.loading;
  protected readonly error = this.notesApiFacade.error;
  protected readonly searchTerm = signal('');
  protected readonly isDialogOpen = signal(false);
  protected readonly editingNote = signal<Note | null>(null);
  protected readonly title = signal('');
  protected readonly body = signal('');
  protected readonly itemId = signal('');
  protected readonly selectedTagNames = signal<string[]>([]);
  protected readonly pinned = signal(false);

  protected readonly filteredNotes = computed(() => {
    const searchTerm = this.searchTerm().trim().toLowerCase();

    return this.notes().filter((note) => {
      const linkedItem = this.linkedItem(note.itemId);
      const searchableText = [
        note.title,
        note.body,
        linkedItem?.title,
        linkedItem?.author,
        linkedItem?.producer,
        ...(note.tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return !searchTerm || searchableText.includes(searchTerm);
    });
  });

  protected readonly pinnedNotes = computed(() =>
    this.filteredNotes().filter((note) => note.pinned),
  );

  protected readonly unpinnedNotes = computed(() =>
    this.filteredNotes().filter((note) => !note.pinned),
  );

  ngOnInit(): void {
    this.notesApiFacade.loadNotes();
    this.tagsApiFacade.loadTags();
    this.libraryApiFacade.loadItems();
  }

  protected openNewNote(): void {
    this.editingNote.set(null);
    this.title.set('');
    this.body.set('');
    this.itemId.set('');
    this.selectedTagNames.set([]);
    this.pinned.set(false);
    this.isDialogOpen.set(true);
  }

  protected editNote(note: Note): void {
    this.editingNote.set(note);
    this.title.set(note.title);
    this.body.set(note.body);
    this.itemId.set(note.itemId ?? '');
    this.selectedTagNames.set(note.tags ?? []);
    this.pinned.set(note.pinned);
    this.isDialogOpen.set(true);
  }

  protected closeDialog(): void {
    this.isDialogOpen.set(false);
    this.editingNote.set(null);
  }

  protected setSearchTerm(event: Event): void {
    this.searchTerm.set(eventValue(event));
  }

  protected setTitle(event: Event): void {
    this.title.set(eventValue(event));
  }

  protected setBody(event: Event): void {
    this.body.set(eventValue(event));
  }

  protected selectItem(event: Event): void {
    this.itemId.set(eventValue(event));
  }

  protected togglePinned(): void {
    this.pinned.update((value) => !value);
  }

  protected toggleNotePinned(note: Note): void {
    this.notesApiFacade.updateNote({
      id: note.id,
      pinned: !note.pinned,
    });
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

  protected saveNote(): void {
    const title = this.title().trim();
    const body = this.body().trim();

    if (!title && !body) {
      return;
    }

    const tags = this.noteTags();
    const note: CreateNotePayload = {
      title: title || 'Untitled note',
      body,
      itemId: this.itemId(),
      tags,
      pinned: this.pinned(),
    };
    const editingNote = this.editingNote();

    if (editingNote) {
      this.notesApiFacade.updateNote({ id: editingNote.id, ...note } satisfies UpdateNotePayload);
    } else {
      this.notesApiFacade.addNote(note);
    }

    this.incrementAssignedTagCounts(tags);
    this.closeDialog();
  }

  protected deleteNote(id: string): void {
    this.notesApiFacade.deleteNote(id);
  }

  protected notePreview(note: Note): string {
    return note.body.length > 150 ? `${note.body.slice(0, 150)}...` : note.body;
  }

  protected linkedItem(itemId: string | undefined): Item | undefined {
    return itemId ? this.items().find((item) => item.id === itemId) : undefined;
  }

  protected itemCreator(item: Item): string {
    return item.author || item.producer || 'Unknown creator';
  }

  private incrementAssignedTagCounts(tags: string[]): void {
    const existingTagNames = new Set(
      (this.editingNote()?.tags ?? []).map((tag) => tag.toLowerCase()),
    );
    const newlyAssignedTags = tags.filter((tag) => !existingTagNames.has(tag.toLowerCase()));
    const uniqueAssignedTagNames = new Set(
      newlyAssignedTags.map((tagName) => tagName.toLowerCase()),
    );

    this.tags()
      .filter((tag) => uniqueAssignedTagNames.has(tag.name.toLowerCase()))
      .forEach((tag) => this.tagsApiFacade.incrementTagCount(tag.id));
  }

  private noteTags(): string[] {
    const existingTagNames = new Set(this.tags().map((tag) => tag.name));

    return [
      ...new Set(
        this.selectedTagNames()
          .map((tagName) => tagName.trim())
          .filter((tagName) => tagName && existingTagNames.has(tagName)),
      ),
    ];
  }
}
