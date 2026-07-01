import { Component, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

@Component({
  selector: 'app-input',
  imports: [InputTextModule, FloatLabelModule, ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class InputComponent {
  control = input<FormControl>(new FormControl(''));
  floatLabel = input<string>('common.input.defaultLabel');
  errorMessage = input<string>('');
  customClass = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');

  protected readonly passwordVisible = signal(false);

  protected displayedType(): InputType {
    return this.type() === 'password' && this.passwordVisible() ? 'text' : this.type();
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }
}
