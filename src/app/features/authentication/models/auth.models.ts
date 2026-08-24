import { AppUser } from '@features/authentication/models/user.models';

export interface AuthenticationApiState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  profileLoading: boolean;
  profileError: string | null;
}

export type UserCredentials = {
  email: string;
  password: string;
};

export type RegistrationDetails = UserCredentials & {
  name: string;
  lastname: string;
};
