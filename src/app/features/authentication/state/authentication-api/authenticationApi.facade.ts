import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserCredentials } from '../../models/auth.models';
import { AuthenticationApiActions } from './authenticationApi.actions';
import {
  selectAuthenticationError,
  selectAuthenticationLoading,
  selectAuthenticationProfile,
  selectAuthenticationProfileError,
  selectAuthenticationProfileLoading,
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
  readonly profile = this.store.selectSignal(selectAuthenticationProfile);
  readonly profileLoading = this.store.selectSignal(
    selectAuthenticationProfileLoading,
  );
  readonly profileError = this.store.selectSignal(
    selectAuthenticationProfileError,
  );
  readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  loginWithEmailAndPassword(user: UserCredentials): void {
    this.store.dispatch(
      AuthenticationApiActions.loginWithEmailAndPassword({ user }),
    );
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
