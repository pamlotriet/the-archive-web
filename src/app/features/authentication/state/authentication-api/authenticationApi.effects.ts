import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { catchError, defer, exhaustMap, filter, map, of, tap } from 'rxjs';
import {
  AuthenticationApiActions,
  AuthenticationApiService,
} from '@features/authentication/state/authentication-api';

@Injectable()
export class AuthenticationApiEffects {
  private readonly document = inject(DOCUMENT);
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthenticationApiService);
  private readonly router = inject(Router);

  readonly restoreAuthenticationOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => this.document.defaultView?.localStorage.getItem('userId') ?? null),
      filter((uid): uid is string => uid !== null),
      map((uid) => AuthenticationApiActions.restoreAuthentication({ uid })),
    ),
  );

  readonly restoreAuthentication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.restoreAuthentication),
      exhaustMap(({ uid }) =>
        defer(() => this.authService.restoreAuthenticatedUser(uid)).pipe(
          map((user) => {
            if (!user) {
              this.clearStoredAuthentication();

              return AuthenticationApiActions.restoreAuthenticationFailure({
                error: 'Stored authentication session is no longer valid',
              });
            }

            return AuthenticationApiActions.restoreAuthenticationSuccess({
              user,
            });
          }),
          catchError((error: unknown) => {
            this.clearStoredAuthentication();

            return of(
              AuthenticationApiActions.restoreAuthenticationFailure({
                error: error instanceof Error ? error.message : 'Unable to restore authentication',
              }),
            );
          }),
        ),
      ),
    ),
  );

  readonly loadUserProfileAfterRestore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.restoreAuthenticationSuccess),
      map(({ user }) =>
        AuthenticationApiActions.loadUserProfile({
          uid: user.uid,
          redirectAfterLoad: false,
        }),
      ),
    ),
  );

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
      tap(({ user }) => this.document.defaultView?.localStorage.setItem('userId', user.uid)),
      map(({ user }) =>
        AuthenticationApiActions.loadUserProfile({
          uid: user.uid,
          redirectAfterLoad: true,
        }),
      ),
    ),
  );

  readonly registerWithCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.registerWithEmailAndPassword),
      exhaustMap(({ user }) =>
        defer(() => this.authService.registerWithEmailAndPassword(user)).pipe(
          map((registeredUser) =>
            AuthenticationApiActions.registerWithEmailAndPasswordSuccess({
              user: registeredUser,
            }),
          ),
          catchError((error: unknown) =>
            of(
              AuthenticationApiActions.registerWithEmailAndPasswordFailure({
                error: error instanceof Error ? error.message : 'Unable to register',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly completeRegistration$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationApiActions.registerWithEmailAndPasswordSuccess),
        tap(({ user }) => {
          const storage = this.document.defaultView?.localStorage;
          storage?.setItem('userId', user.uid);
          storage?.setItem('isAuthenticated', 'true');
        }),
        tap(() => void this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  readonly authenticateWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationApiActions.authenticateWithGoogle),
      exhaustMap(() =>
        defer(() => this.authService.authenticateWithGoogle()).pipe(
          map((user) => AuthenticationApiActions.authenticateWithGoogleSuccess({ user })),
          catchError((error: unknown) =>
            of(
              AuthenticationApiActions.authenticateWithGoogleFailure({
                error:
                  error instanceof Error ? error.message : 'Unable to authenticate with Google',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly completeGoogleAuthentication$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationApiActions.authenticateWithGoogleSuccess),
        tap(({ user }) => {
          const storage = this.document.defaultView?.localStorage;
          storage?.setItem('userId', user.uid);
          storage?.setItem('isAuthenticated', 'true');
        }),
        tap(() => void this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
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
        tap(() => {
          this.document.defaultView?.localStorage.setItem('isAuthenticated', 'true');
          void this.router.navigate(['/dashboard']);
        }),
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

  readonly navigateToLoginAfterLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationApiActions.logoutSuccess),
        tap(() => {
          this.clearStoredAuthentication();
          void this.router.navigate(['/authentication']);
        }),
      ),
    { dispatch: false },
  );

  private clearStoredAuthentication(): void {
    this.document.defaultView?.localStorage.removeItem('isAuthenticated');
    this.document.defaultView?.localStorage.removeItem('userId');
  }
}
