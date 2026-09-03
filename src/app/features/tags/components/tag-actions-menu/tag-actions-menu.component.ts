import { Component, EventEmitter, Output, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';

@Component({
  selector: 'app-tag-actions-menu',
  imports: [PIcon],
  templateUrl: './tag-actions-menu.component.html',
})
export class TagActionsMenuComponent {
  @Output() readonly tagEdit = new EventEmitter<void>();
  @Output() readonly tagDelete = new EventEmitter<void>();

  protected readonly isOpen = signal(false);

  protected toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected edit(): void {
    this.tagEdit.emit();
    this.close();
  }

  protected delete(): void {
    this.tagDelete.emit();
    this.close();
  }

  private close(): void {
    this.isOpen.set(false);
  }
}
