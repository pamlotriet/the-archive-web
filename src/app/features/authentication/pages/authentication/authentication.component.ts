import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import { ButtonComponent } from '@shared/components/button/button';
import { InputComponent } from '@shared/components/input/input';
import { AuthenticationApiFacade } from '../../state/authentication-api';
import { AuthenticationForm } from './types/authentication.types';

@Component({
  selector: 'app-authentication',
  host: {
    class: 'block w-full',
  },
  imports: [
    InputComponent,
    ButtonComponent,
    TranslatePipe,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './authentication.component.html',
})
export class AuthenticationComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authenticationApiFacade = inject(AuthenticationApiFacade);

  readonly authenticationError = this.authenticationApiFacade.error;
  readonly authenticationLoading = this.authenticationApiFacade.loading;

  readonly isRegistering = toSignal(
    combineLatest([this.route.url, this.route.queryParamMap]).pipe(
      map(
        ([segments, params]) =>
          params.get('mode') === 'register' ||
          segments.some((segment) => segment.path === 'register'),
      ),
    ),
    { initialValue: false },
  );

  readonly authenticationForm: AuthenticationForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    lastname: new FormControl('', { nonNullable: true }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  constructor() {
    effect(() => {
      const profileValidators = this.isRegistering()
        ? [Validators.required]
        : [];

      this.authenticationForm.controls.name.setValidators(profileValidators);
      this.authenticationForm.controls.lastname.setValidators(
        profileValidators,
      );
      this.authenticationForm.controls.name.updateValueAndValidity({
        emitEvent: false,
      });
      this.authenticationForm.controls.lastname.updateValueAndValidity({
        emitEvent: false,
      });
    });
  }

  onSubmit(): void {
    if (this.authenticationForm.invalid) {
      this.authenticationForm.markAllAsTouched();
      return;
    }

    const { name, lastname, email, password } =
      this.authenticationForm.getRawValue();

    if (this.isRegistering()) {
      this.authenticationApiFacade.registerWithEmailAndPassword({
        name,
        lastname,
        email,
        password,
      });
      return;
    }

    this.authenticationApiFacade.loginWithEmailAndPassword({
      email,
      password,
    });
  }

  authenticateWithGoogle(): void {
    this.authenticationApiFacade.authenticateWithGoogle();
  }
}
