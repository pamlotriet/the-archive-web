import { Component, input, output, signal } from '@angular/core';
import { PIcon } from '@primeicons/angular/p-icon';

@Component({
  selector: 'app-item-actions-menu',
  imports: [PIcon],
  templateUrl: './item-actions-menu.component.html',
})
export class ItemActionsMenuComponent {
  readonly buttonClass = input(
    'grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground',
  );
  readonly menuClass = input(
    'absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-xl border border-border bg-slate-950 p-1 text-sm text-white shadow-xl shadow-slate-950/40',
  );
  readonly itemEdit = output<void>();
  readonly itemDelete = output<void>();

  protected readonly isOpen = signal(false);

  protected toggleActions(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  protected editItem(): void {
    this.itemEdit.emit();
    this.closeActions();
  }

  protected deleteItem(): void {
    this.itemDelete.emit();
    this.closeActions();
  }

  private closeActions(): void {
    this.isOpen.set(false);
  }
}
