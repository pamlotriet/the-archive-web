import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, defer, exhaustMap, filter, map, of, tap } from 'rxjs';
import { AuthenticationApiActions } from './authenticationApi.actions';
import { AuthenticationApiService } from './authenticationApi.service';

@Injectable()
export class AuthenticationApiEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthenticationApiService);
  private readonly router = inject(Router);

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

  readonly loadUserProfileAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.loginWithEmailAndPasswordSuccess),
      map(({ user }) =>
        AuthenticationApiActions.loadUserProfile({
          uid: user.uid,
          redirectAfterLoad: true,
        }),
      ),
    ),
  );

  readonly loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.loadUserProfile),
      exhaustMap(({ uid, redirectAfterLoad }) =>
        defer(() => this.authService.getUserProfile(uid)).pipe(
          map((profile) => {
            if (!profile) {
              return AuthenticationApiActions.loadUserProfileFailure({
                error: 'User profile not found',
              });
            }

            return AuthenticationApiActions.loadUserProfileSuccess({
              profile,
              redirectAfterLoad,
            });
          }),
          catchError((error: unknown) =>
            of(
              AuthenticationApiActions.loadUserProfileFailure({
                error: error instanceof Error ? error.message : 'Unable to load user profile',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly navigateToDashboardAfterProfileLoad$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationApiActions.loadUserProfileSuccess),
        filter(({ redirectAfterLoad }) => redirectAfterLoad),
        tap(() => void this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
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
