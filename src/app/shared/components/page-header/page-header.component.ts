import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  imports: [TranslatePipe],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  readonly eyebrowKey = input.required<string>();
  readonly titleKey = input.required<string>();
  readonly summaryKey = input<string>();
  readonly summaryParams = input<Record<string, unknown>>();
  readonly titleClass = input('mt-2 font-serif text-3xl font-bold text-foreground sm:text-4xl');
  readonly layoutClass = input(
    'flex flex-col gap-5 border-b border-border/70 pb-8 xl:flex-row xl:items-end xl:justify-between',
  );
}
