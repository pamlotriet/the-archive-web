import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { eventValue } from '@shared/utils/form-event';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { TagsApiFacade } from '@features/tags/state/tags-api';

@Component({
  selector: 'app-tags',
  host: {
    class: 'block min-w-0 w-full',
  },
  imports: [TranslatePipe, ButtonComponent, PageHeaderComponent, PIcon],
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
  protected readonly newTagName = signal('');
  protected readonly selectedTagColor = signal('#11b981');
  protected readonly visibleTags = this.firebaseTags;
  protected readonly tagsInUseCount = computed(
    () => this.visibleTags().filter((tag) => tag.count > 0).length,
  );

  protected readonly colorOptions = [
    { id: 'red', labelKey: 'tags.newTagDialog.colors.red', color: '#ef4444' },
    { id: 'orange', labelKey: 'tags.newTagDialog.colors.orange', color: '#f97316' },
    { id: 'amber', labelKey: 'tags.newTagDialog.colors.amber', color: '#dca945' },
    { id: 'yellow', labelKey: 'tags.newTagDialog.colors.yellow', color: '#eab308' },
    { id: 'lime', labelKey: 'tags.newTagDialog.colors.lime', color: '#84cc16' },
    { id: 'emerald', labelKey: 'tags.newTagDialog.colors.emerald', color: '#11b981' },
    { id: 'teal', labelKey: 'tags.newTagDialog.colors.teal', color: '#14b8a6' },
    { id: 'cyan', labelKey: 'tags.newTagDialog.colors.cyan', color: '#06b6d4' },
    { id: 'sky', labelKey: 'tags.newTagDialog.colors.sky', color: '#0ea5e9' },
    { id: 'blue', labelKey: 'tags.newTagDialog.colors.blue', color: '#3b82f6' },
    { id: 'indigo', labelKey: 'tags.newTagDialog.colors.indigo', color: '#6366f1' },
    { id: 'violet', labelKey: 'tags.newTagDialog.colors.violet', color: '#8b5cf6' },
    { id: 'fuchsia', labelKey: 'tags.newTagDialog.colors.fuchsia', color: '#d946ef' },
    { id: 'pink', labelKey: 'tags.newTagDialog.colors.pink', color: '#ec4899' },
    { id: 'rose', labelKey: 'tags.newTagDialog.colors.rose', color: '#f43f5e' },
    { id: 'slate', labelKey: 'tags.newTagDialog.colors.slate', color: '#64748b' },
  ];

  protected setTagColor(event: Event): void {
    const color = eventValue(event);

    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      return;
    }

    this.selectTagColor(color.toLowerCase());
  }

  protected selectTagColor(color: string): void {
    this.selectedTagColor.set(color);
  }

  ngOnInit(): void {
    this.tagsApiFacade.loadTags();
  }

  protected setNewTagName(event: Event): void {
    this.newTagName.set(eventValue(event));
  }

  protected saveNewTag(event?: Event): void {
    event?.preventDefault();

    const name = this.newTagName().trim();

    if (!name) {
      return;
    }

    this.tagsApiFacade.addTag({
      name,
      color: this.selectedTagColor(),
    });
    this.closeNewEntry();
  }

  protected previewTagName(): string {
    return this.newTagName().trim() || 'New tag';
  }

  protected updateTag(id: string, name: string, color: string): void {
    this.tagsApiFacade.updateTag({ id, name, color });
  }

  protected deleteTag(id: string): void {
    this.tagsApiFacade.deleteTag(id);
  }

  protected tagColorStyle(color = this.selectedTagColor()): Record<string, string> {
    return {
      background: `linear-gradient(90deg, ${color}, ${this.mixWithBlack(color, 0.45)})`,
    };
  }
  protected readonly openActionsTagId = signal<string | null>(null);

  protected toggleActions(tagId: string): void {
    this.openActionsTagId.update((currentTagId) => (currentTagId === tagId ? null : tagId));
  }

  protected closeActions(): void {
    this.openActionsTagId.set(null);
  }

  protected isActionsOpen(tagId: string): boolean {
    return this.openActionsTagId() === tagId;
  }

  protected tagCountProgress(count: number): number {
    return Math.min(Math.max(count, 0), 100);
  }

  protected tagSwatchStyle(color = this.selectedTagColor()): Record<string, string> {
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
    this.newTagName.set('');
    this.selectedTagColor.set('#11b981');
  }
}
