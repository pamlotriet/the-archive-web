import { NgClass } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PIcon } from '@primeicons/angular/p-icon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputType } from '@shared/components/input/types/input.type';

@Component({
  selector: 'app-input',
  imports: [
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
    PIcon,
    NgClass,
  ],
  templateUrl: './input.html',
})
export class InputComponent {
  control = input<FormControl>(new FormControl(''));
  floatLabel = input<string>('common.input.defaultLabel');
  errorMessage = input<string>('');
  customClass = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  iconName = input<string>('');
  iconPosition = input<'left' | 'right'>('left');
  showIcon = input<boolean>(false);

  protected readonly passwordVisible = signal(false);

  protected displayedType(): InputType {
    return this.type() === 'password' && this.passwordVisible() ? 'text' : this.type();
  }

  protected inputClasses(): string {
    const passwordPadding =
      this.type() === 'password'
        ? this.showIcon() && this.iconPosition() === 'right'
          ? 'pr-20!'
          : 'pr-11!'
        : '';

    return [this.customClass(), passwordPadding].filter(Boolean).join(' ');
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }
}
