import { UserCredentials } from '../../models/auth.models';
import { AppUser, UserProfile } from '../../models/user.models';

export interface AuthenticationApiInterface {
  loginWithEmailAndPassword(user: UserCredentials): Promise<AppUser>;
  getUserProfile(uid: string): Promise<UserProfile | null>;
  logout(): Promise<void>;
}
