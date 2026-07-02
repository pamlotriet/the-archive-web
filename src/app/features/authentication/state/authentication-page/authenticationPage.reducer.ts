import { createReducer } from '@ngrx/store';
import { initialState } from './authenticationPage.state';

export const authenticationPageFeatureKey = 'authenticationPage';

export const authenticationPageReducer = createReducer(initialState);
