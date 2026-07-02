import { createFeatureSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.state';

export const selectAuthenticationState =
  createFeatureSelector<AuthenticationState>('authentication');
