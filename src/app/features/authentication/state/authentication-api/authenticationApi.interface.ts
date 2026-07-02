import { UserCredentials } from '../../models/auth.models';
import { AppUser } from '../../models/user.models';

export interface AuthenticationApiInterface {
  loginWithEmailAndPassword(user: UserCredentials): Promise<AppUser>;
  logout(): Promise<void>;
}
