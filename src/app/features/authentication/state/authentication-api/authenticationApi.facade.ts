import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RegistrationDetails, UserCredentials } from '@features/authentication/models/auth.models';
import {
  AuthenticationApiActions,
  selectAuthenticationError,
  selectAuthenticationLoading,
  selectAuthenticationProfile,
  selectAuthenticationProfileError,
  selectAuthenticationProfileLoading,
  selectAuthenticationUser,
  selectIsAuthenticated,
} from '@features/authentication/state/authentication-api';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiFacade {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(selectAuthenticationUser);
  readonly loading = this.store.selectSignal(selectAuthenticationLoading);
  readonly error = this.store.selectSignal(selectAuthenticationError);
  readonly profile = this.store.selectSignal(selectAuthenticationProfile);
  readonly profileLoading = this.store.selectSignal(selectAuthenticationProfileLoading);
  readonly profileError = this.store.selectSignal(selectAuthenticationProfileError);
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  loginWithEmailAndPassword(user: UserCredentials): void {
    this.store.dispatch(AuthenticationApiActions.loginWithEmailAndPassword({ user }));
  }

  registerWithEmailAndPassword(user: RegistrationDetails): void {
    this.store.dispatch(AuthenticationApiActions.registerWithEmailAndPassword({ user }));
  }

  authenticateWithGoogle(): void {
    this.store.dispatch(AuthenticationApiActions.authenticateWithGoogle());
  }

  loadUserProfile(uid: string): void {
    this.store.dispatch(
      AuthenticationApiActions.loadUserProfile({
        uid,
        redirectAfterLoad: false,
      }),
    );
  }

  logout(): void {
    this.store.dispatch(AuthenticationApiActions.logout());
  }
}
