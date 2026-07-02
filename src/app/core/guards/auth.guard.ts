import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {
  AuthenticationApiFacade,
  AuthenticationApiService,
} from '@features/authentication/state/authentication-api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthenticationApiFacade);
  private readonly authService = inject(AuthenticationApiService);

  canActivate(): boolean | UrlTree | Promise<boolean | UrlTree> {
    if (this.authFacade.isAuthenticated()) {
      return true;
    }

    const storage = this.document.defaultView?.localStorage;
    const uid = storage?.getItem('userId');

    if (!uid) {
      return this.router.createUrlTree(['/login']);
    }

    return this.authService.restoreAuthenticatedUser(uid).then((user) => {
      if (user) {
        return true;
      }

      storage?.removeItem('isAuthenticated');
      storage?.removeItem('userId');

      return this.router.createUrlTree(['/login']);
    });
  }
}
