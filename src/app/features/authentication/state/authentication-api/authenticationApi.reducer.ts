import { createReducer, on } from '@ngrx/store';
import { AuthenticationApiActions } from '@features/authentication/state/authentication-api/authenticationApi.actions';
import { initialState } from '@features/authentication/state/authentication-api/authenticationApi.state';

export const authenticationApiFeatureKey = 'authenticationApi';

export const authenticationApiReducer = createReducer(
  initialState,
  on(AuthenticationApiActions.loginWithEmailAndPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthenticationApiActions.loginWithEmailAndPasswordSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
  })),
  on(AuthenticationApiActions.loginWithEmailAndPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthenticationApiActions.registerWithEmailAndPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthenticationApiActions.registerWithEmailAndPasswordSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
  })),
  on(AuthenticationApiActions.registerWithEmailAndPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthenticationApiActions.authenticateWithGoogle, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthenticationApiActions.authenticateWithGoogleSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
  })),
  on(AuthenticationApiActions.authenticateWithGoogleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthenticationApiActions.restoreAuthentication, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthenticationApiActions.restoreAuthenticationSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
  })),
  on(AuthenticationApiActions.restoreAuthenticationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    user: null,
  })),
  on(AuthenticationApiActions.loadUserProfile, (state) => ({
    ...state,
    profileLoading: true,
    profileError: null,
  })),
  on(AuthenticationApiActions.loadUserProfileSuccess, (state, { profile }) => ({
    ...state,
    profileLoading: false,
    user: state.user ? { ...state.user, ...profile } : null,
  })),
  on(AuthenticationApiActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    profileLoading: false,
    profileError: error,
  })),
  on(AuthenticationApiActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthenticationApiActions.logoutSuccess, (state) => ({
    ...state,
    loading: false,
    user: null,
    profileLoading: false,
    profileError: null,
  })),
  on(AuthenticationApiActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
