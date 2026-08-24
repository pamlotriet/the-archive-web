import { RegistrationDetails, UserCredentials } from '@features/authentication/models/auth.models';
import { AppUser, UserProfile } from '@features/authentication/models/user.models';

export interface AuthenticationApiInterface {
  loginWithEmailAndPassword(user: UserCredentials): Promise<AppUser>;
  registerWithEmailAndPassword(user: RegistrationDetails): Promise<AppUser>;
  authenticateWithGoogle(): Promise<AppUser>;
  restoreAuthenticatedUser(uid: string): Promise<AppUser | null>;
  getUserProfile(uid: string): Promise<UserProfile | null>;
  logout(): Promise<void>;
}
