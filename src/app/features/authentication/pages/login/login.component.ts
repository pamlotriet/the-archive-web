import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button';
import { InputComponent } from '@shared/components/input/input';
import { AuthenticationApiFacade } from '../../state/authentication-api';
import { LoginForm } from './types/login.types';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent, TranslatePipe, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authenticationApiFacade = inject(AuthenticationApiFacade);

  readonly loginForm: LoginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authenticationApiFacade.loginWithEmailAndPassword(this.loginForm.getRawValue());
    }
  }
}
