import { createReducer, on } from '@ngrx/store';
import { initialState } from './authenticationApi.state';
import { AuthenticationApiActions } from './authenticationApi.actions';

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
  on(AuthenticationApiActions.logout, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthenticationApiActions.logoutSuccess, (state) => ({
    ...state,
    loading: false,
    user: null,
  })),
  on(AuthenticationApiActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
