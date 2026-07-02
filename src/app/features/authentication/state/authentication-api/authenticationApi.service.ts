import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import {
  firebaseAuth,
  firebaseFirestore,
} from '../../../../core/data/firebase/firebase.config';
import { AuthenticationApiInterface } from './authenticationApi.interface';
import { AppUser, UserProfile } from '../../models/user.models';
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

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const profileQuery = query(
      collection(firebaseFirestore, 'users'),
      where('uuid', '==', uid),
      limit(1),
    );
    
    const snapshot = await getDocs(profileQuery);
    const document = snapshot.docs[0];

    if (!document) {
      return null;
    }

    const data = document.data();

    return {
      name: typeof data['name'] === 'string' ? data['name'] : null,
      lastname:
        typeof data['lastname'] === 'string' ? data['lastname'] : null,
    };
  }

  private toAppUser(user: User): AppUser {
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      lastname: null,
      displayName: user.displayName,
      photoUrl: user.photoURL,
    };
  }
}
