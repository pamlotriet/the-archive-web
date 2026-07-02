import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserCredentials } from '../../models/auth.models';
import { AuthenticationApiActions } from './authenticationApi.actions';
import {
  selectAuthenticationError,
  selectAuthenticationLoading,
  selectAuthenticationUser,
  selectIsAuthenticated,
} from './authenticationApi.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiFacade {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(selectAuthenticationUser);
  readonly loading = this.store.selectSignal(selectAuthenticationLoading);
  readonly error = this.store.selectSignal(selectAuthenticationError);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  loginWithEmailAndPassword(user: UserCredentials): void {
    this.store.dispatch(
      AuthenticationApiActions.loginWithEmailAndPassword({ user }),
    );
  }

  logout(): void {
    this.store.dispatch(AuthenticationApiActions.logout());
  }
}
