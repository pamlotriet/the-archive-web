import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { ButtonDirective } from 'primeng/button';
import { ButtonSeverity, ButtonVariant } from '@shared/components/button/types/button.types';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-button',
  imports: [ButtonDirective, TranslatePipe, ButtonModule, PIcon, NgClass],
  templateUrl: './button.html',
})
export class ButtonComponent {
  readonly buttonClick = output<void>();

  buttonText = input<string>('common.button.defaultLabel');
  iconName = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  iconOnly = input<boolean>(false);
  showIcon = input<boolean>(false);
  severity = input<ButtonSeverity>('primary');
  variant = input<ButtonVariant>();
  rounded = input<boolean>(false);
  active = input<boolean>(false);
  customClass = input<string>('');
}
