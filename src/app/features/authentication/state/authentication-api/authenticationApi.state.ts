import { AuthenticationApiState } from '../../models/auth.models';

export const initialState: AuthenticationApiState = {
  user: null,
  loading: false,
  error: null,
  profileLoading: false,
  profileError: null,
};
