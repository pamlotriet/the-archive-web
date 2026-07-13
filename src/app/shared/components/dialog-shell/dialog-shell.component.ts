import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';

@Component({
  selector: 'app-dialog-shell',
  imports: [PIcon, TranslatePipe],
  templateUrl: './dialog-shell.component.html',
})
export class DialogShellComponent {
  readonly ariaLabelKey = input.required<string>();
  readonly eyebrowKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly descriptionKey = input<string>();
  readonly closeLabelKey = input.required<string>();
  readonly overlayClass = input(
    'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-6 backdrop-blur-sm',
  );
  readonly panelClass = input(
    'flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl',
  );
  readonly bodyClass = input('grid gap-5 overflow-y-auto p-6');
  readonly footerClass = input('flex justify-end gap-3 border-t border-border/70 p-6');
  readonly dialogClose = output<void>();
}
