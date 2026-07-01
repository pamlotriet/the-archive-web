import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonDirective } from 'primeng/button';
import { ButtonSeverity, ButtonVariant } from '@shared/components/button/types/button.types';

@Component({
  selector: 'app-button',
  imports: [ButtonDirective, TranslatePipe],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonComponent {
  buttonText = input<string>('common.button.defaultLabel');
  iconName = input<string>('home');
  iconPosition = input<'left' | 'right'>('left');
  iconOnly = input<boolean>(false);
  showIcon = input<boolean>(false);
  severity = input<ButtonSeverity>('primary');
  variant = input<ButtonVariant>();
  rounded = input<boolean>(false);
  customClass = input<string>('');
}
