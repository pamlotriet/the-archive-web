import { Component, input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { ButtonSeverity, ButtonVariant } from './types/button.types';

@Component({
  selector: 'app-button',
  imports: [ButtonDirective],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  buttonText = input<string>('Button');
  iconName = input<string>('home');
  iconPosition = input<'left' | 'right'>('left');
  iconOnly = input<boolean>(false);
  showIcon = input<boolean>(false);
  severity = input<ButtonSeverity>('primary');
  variant = input<ButtonVariant>();
  rounded = input<boolean>(false);
}
