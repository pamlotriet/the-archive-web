import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { firebaseAuth } from '../../../../core/data/firebase/firebase.config';
import { AuthenticationApiInterface } from './authenticationApi.interface';
import { AppUser } from '../../models/user.models';
import { UserCredentials } from '../../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService implements AuthenticationApiInterface {
  async loginWithEmailAndPassword(user: UserCredentials): Promise<AppUser> {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      user.email,
      user.password,
    );

    return this.toAppUser(credential.user);
  }

  logout(): Promise<void> {
    return signOut(firebaseAuth);
  }

  private toAppUser(user: User): AppUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL,
    };
  }
}
