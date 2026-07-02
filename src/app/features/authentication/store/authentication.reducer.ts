import { createReducer } from '@ngrx/store';
import { initialState } from './authentication.state';

export const authenticationFeatureKey = 'authentication';

export const authenticationReducer = createReducer(
  initialState,
);
