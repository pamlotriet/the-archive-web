import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, defer, exhaustMap, map, of } from 'rxjs';
import { AuthenticationApiActions } from './authenticationApi.actions';
import { AuthenticationApiService } from './authenticationApi.service';

@Injectable()
export class AuthenticationApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthenticationApiService);

  readonly loginWithCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.loginWithEmailAndPassword),
      // Ignore repeated login attempts until the current request completes.
      exhaustMap(({ user }) =>
        defer(() => this.authService.loginWithEmailAndPassword(user)).pipe(
          map((authenticatedUser) =>
            AuthenticationApiActions.loginWithEmailAndPasswordSuccess({
              user: authenticatedUser,
            }),
          ),
          catchError((error: unknown) =>
            of(
              AuthenticationApiActions.loginWithEmailAndPasswordFailure({
                error: error instanceof Error ? error.message : 'Unable to sign in',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.logout),
      exhaustMap(() =>
        defer(() => {
          return this.authService.logout();
        }).pipe(
          map(() => AuthenticationApiActions.logoutSuccess()),
          catchError((error: unknown) =>
            of(
              AuthenticationApiActions.logoutFailure({
                error: error instanceof Error ? error.message : 'Unable to log out',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
