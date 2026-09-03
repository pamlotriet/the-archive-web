import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { PIcon } from '@primeicons/angular/p-icon';
import { TagsApiFacade } from '@features/tags/state/tags-api';
import { TagActionsMenuComponent } from '@features/tags/components/tag-actions-menu/tag-actions-menu.component';
import {
  NewTagDialogComponent,
  NewTagPayload,
} from '@features/tags/components/new-tag-dialog/new-tag-dialog.component';

@Component({
  selector: 'app-tags',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [
    ButtonComponent,
    PageHeaderComponent,
    PIcon,
    TagActionsMenuComponent,
    NewTagDialogComponent,
  ],
  templateUrl: './tags.component.html',
})
export class TagsComponent implements OnInit {
  private readonly tagsApiFacade = inject(TagsApiFacade);

  protected readonly firebaseTags = this.tagsApiFacade.tags;
  protected readonly tagsLoading = this.tagsApiFacade.loading;
  protected readonly tagsSaving = this.tagsApiFacade.saving;
  protected readonly tagsDeleting = this.tagsApiFacade.deleting;
  protected readonly tagsError = this.tagsApiFacade.error;

  protected readonly isNewEntryOpen = signal(false);
  protected readonly visibleTags = this.firebaseTags;
  protected readonly tagsInUseCount = computed(
    () => this.visibleTags().filter((tag) => tag.count > 0).length,
  );

  ngOnInit(): void {
    this.tagsApiFacade.loadTags();
  }

  protected saveNewTag(tag: NewTagPayload): void {
    this.tagsApiFacade.addTag(tag);
    this.closeNewEntry();
  }

  protected updateTag(id: string, name: string, color: string): void {
    this.tagsApiFacade.updateTag({ id, name, color });
  }

  protected deleteTag(id: string): void {
    this.tagsApiFacade.deleteTag(id);
  }

  protected tagCountProgress(count: number): number {
    return Math.min(Math.max(count, 0), 100);
  }

  protected tagSwatchStyle(color = '#11b981'): Record<string, string> {
    return {
      background: `linear-gradient(135deg, ${color}, ${this.mixWithBlack(color, 0.5)})`,
    };
  }

  private mixWithBlack(hex: string, amount: number): string {
    const [red, green, blue] = this.hexToRgb(hex);

    return this.rgbToHex(
      Math.round(red * amount),
      Math.round(green * amount),
      Math.round(blue * amount),
    );
  }

  private hexToRgb(hex: string): [number, number, number] {
    const normalizedHex = hex.replace('#', '');

    return [
      Number.parseInt(normalizedHex.slice(0, 2), 16),
      Number.parseInt(normalizedHex.slice(2, 4), 16),
      Number.parseInt(normalizedHex.slice(4, 6), 16),
    ];
  }

  private rgbToHex(red: number, green: number, blue: number): string {
    return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
  }

  protected openNewEntry(): void {
    this.isNewEntryOpen.set(true);
  }

  protected closeNewEntry(): void {
    this.isNewEntryOpen.set(false);
  }
}
