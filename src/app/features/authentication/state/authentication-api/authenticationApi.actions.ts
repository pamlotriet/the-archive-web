import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserCredentials } from '../../models/auth.models';
import { AppUser } from '../../models/user.models';

export const AuthenticationApiActions = createActionGroup({
  source: 'AuthenticationApi',
  events: {
    Load: emptyProps(),
    loginWithEmailAndPassword: props<{ user: UserCredentials }>(),
    loginWithEmailAndPasswordSuccess: props<{ user: AppUser }>(),
    loginWithEmailAndPasswordFailure: props<{ error: string }>(),
    logout: emptyProps(),
    logoutSuccess: emptyProps(),
    logoutFailure: props<{ error: string }>(),
  },
});
