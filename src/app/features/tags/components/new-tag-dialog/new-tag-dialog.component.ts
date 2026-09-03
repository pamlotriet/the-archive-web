import { Component, EventEmitter, Output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { eventValue } from '@shared/utils/form-event';

export interface NewTagPayload {
  name: string;
  color: string;
}

@Component({
  selector: 'app-new-tag-dialog',
  imports: [PIcon, TranslatePipe],
  templateUrl: './new-tag-dialog.component.html',
})
export class NewTagDialogComponent {
  @Output() readonly dialogClose = new EventEmitter<void>();
  @Output() readonly tagSave = new EventEmitter<NewTagPayload>();

  protected readonly tagName = signal('');
  protected readonly selectedColor = signal('#11b981');

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

  protected setTagName(event: Event): void {
    this.tagName.set(eventValue(event));
  }

  protected setColor(event: Event): void {
    const color = eventValue(event);

    if (/^#[0-9a-fA-F]{6}$/.test(color)) {
      this.selectColor(color.toLowerCase());
    }
  }

  protected selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  protected previewName(): string {
    return this.tagName().trim() || 'New tag';
  }

  protected save(event: Event): void {
    event.preventDefault();
    const name = this.tagName().trim();

    if (name) {
      this.tagSave.emit({ name, color: this.selectedColor() });
    }
  }

  protected close(): void {
    this.dialogClose.emit();
  }

  protected colorStyle(color = this.selectedColor()): Record<string, string> {
    return {
      background: `linear-gradient(90deg, ${color}, ${this.mixWithBlack(color, 0.45)})`,
    };
  }

  protected swatchStyle(color = this.selectedColor()): Record<string, string> {
    return {
      background: `linear-gradient(135deg, ${color}, ${this.mixWithBlack(color, 0.5)})`,
    };
  }

  private mixWithBlack(hex: string, amount: number): string {
    const normalizedHex = hex.replace('#', '');
    const colors = [0, 2, 4].map((offset) =>
      Math.round(Number.parseInt(normalizedHex.slice(offset, offset + 2), 16) * amount),
    );

    return `#${colors.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
  }
}
