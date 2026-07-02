import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationApiState } from '../../models/auth.models';
import { authenticationApiFeatureKey } from './authenticationApi.reducer';

export const selectAuthenticationApiState =
  createFeatureSelector<AuthenticationApiState>(authenticationApiFeatureKey);

export const selectAuthenticationUser = createSelector(
  selectAuthenticationApiState,
  (state) => state.user,
);

export const selectAuthenticationLoading = createSelector(
  selectAuthenticationApiState,
  (state) => state.loading,
);

export const selectAuthenticationError = createSelector(
  selectAuthenticationApiState,
  (state) => state.error,
);

export const selectAuthenticationProfileLoading = createSelector(
  selectAuthenticationApiState,
  (state) => state.profileLoading,
);

export const selectAuthenticationProfileError = createSelector(
  selectAuthenticationApiState,
  (state) => state.profileError,
);

export const selectAuthenticationProfile = createSelector(
  selectAuthenticationUser,
  (user) =>
    user
      ? {
          name: user.name,
          lastname: user.lastname,
        }
      : null,
);

export const selectIsAuthenticated = createSelector(
  selectAuthenticationUser,
  (user) => user !== null,
);
