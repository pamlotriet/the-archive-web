import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@shared/components/button/button';
import { InputComponent } from '@shared/components/input/input';
import { LoginForm } from './types/login.types';

@Component({
  selector: 'app-login',
  imports: [InputComponent, ButtonComponent, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: LoginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });
}
