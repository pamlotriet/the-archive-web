import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthenticationPageActions } from './authenticationPage.actions';
import { selectAuthenticationPageState } from './authenticationPage.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationPageFacade {
  private readonly store = inject(Store);

  readonly state = this.store.selectSignal(selectAuthenticationPageState);

  load(): void {
    this.store.dispatch(AuthenticationPageActions.load());
  }
}
