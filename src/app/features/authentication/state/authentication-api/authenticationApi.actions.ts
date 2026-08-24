import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RegistrationDetails, UserCredentials } from '@features/authentication/models/auth.models';
import { AppUser, UserProfile } from '@features/authentication/models/user.models';

export const AuthenticationApiActions = createActionGroup({
  source: 'AuthenticationApi',
  events: {
    Load: emptyProps(),
    loginWithEmailAndPassword: props<{ user: UserCredentials }>(),
    loginWithEmailAndPasswordSuccess: props<{ user: AppUser }>(),
    loginWithEmailAndPasswordFailure: props<{ error: string }>(),
    registerWithEmailAndPassword: props<{ user: RegistrationDetails }>(),
    registerWithEmailAndPasswordSuccess: props<{ user: AppUser }>(),
    registerWithEmailAndPasswordFailure: props<{ error: string }>(),
    authenticateWithGoogle: emptyProps(),
    authenticateWithGoogleSuccess: props<{ user: AppUser }>(),
    authenticateWithGoogleFailure: props<{ error: string }>(),
    restoreAuthentication: props<{ uid: string }>(),
    restoreAuthenticationSuccess: props<{ user: AppUser }>(),
    restoreAuthenticationFailure: props<{ error: string }>(),
    loadUserProfile: props<{ uid: string; redirectAfterLoad: boolean }>(),
    loadUserProfileSuccess: props<{
      profile: UserProfile;
      redirectAfterLoad: boolean;
    }>(),
    loadUserProfileFailure: props<{ error: string }>(),
    logout: emptyProps(),
    logoutSuccess: emptyProps(),
    logoutFailure: props<{ error: string }>(),
  },
});
