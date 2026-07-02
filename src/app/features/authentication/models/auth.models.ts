import { AppUser } from './user.models';

export interface AuthenticationApiState {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
}

export type UserCredentials = {
  email: string;
  password: string;
};
