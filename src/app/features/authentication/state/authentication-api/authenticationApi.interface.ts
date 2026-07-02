import { UserCredentials } from '../../models/auth.models';
import { AppUser, UserProfile } from '../../models/user.models';

export interface AuthenticationApiInterface {
  loginWithEmailAndPassword(user: UserCredentials): Promise<AppUser>;
  restoreAuthenticatedUser(uid: string): Promise<AppUser | null>;
  getUserProfile(uid: string): Promise<UserProfile | null>;
  logout(): Promise<void>;
}
