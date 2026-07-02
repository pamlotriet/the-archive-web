import { createFeatureSelector } from '@ngrx/store';
import { AuthenticationPageState } from './authenticationPage.state';

export const selectAuthenticationPageState =
  createFeatureSelector<AuthenticationPageState>('authenticationPage');
