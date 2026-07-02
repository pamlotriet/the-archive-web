import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  signOut,
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { collection, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { firebaseAuth, firebaseFirestore } from '../../../../core/data/firebase/firebase.config';
import { AuthenticationApiInterface } from './authenticationApi.interface';
import { AppUser, UserProfile } from '../../models/user.models';
import { RegistrationDetails, UserCredentials } from '../../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService implements AuthenticationApiInterface {
  async loginWithEmailAndPassword(user: UserCredentials): Promise<AppUser> {
    const credential = await signInWithEmailAndPassword(firebaseAuth, user.email, user.password);
    return this.toAppUser(credential.user);
  }

  logout(): Promise<void> {
    return signOut(firebaseAuth);
  }

  async restoreAuthenticatedUser(uid: string): Promise<AppUser | null> {
    await firebaseAuth.authStateReady();
    const user = firebaseAuth.currentUser;

    return user?.uid === uid ? this.toAppUser(user) : null;
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
      lastname: typeof data['lastname'] === 'string' ? data['lastname'] : null,
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

  async registerWithEmailAndPassword(user: RegistrationDetails): Promise<AppUser> {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      user.email,
      user.password,
    );
    const profile: UserProfile = {
      name: user.name,
      lastname: user.lastname,
    };

    await this.addUserProfileToFirestore(
      credential.user.uid,
      profile,
      credential.user.email,
    );

    return {
      ...this.toAppUser(credential.user),
      ...profile,
    };
  }

  private addUserProfileToFirestore(
    uid: string,
    profile: UserProfile,
    email: string | null,
  ): Promise<void> {
    const userProfileRef = doc(firebaseFirestore, 'users', uid);

    return setDoc(userProfileRef, {
      ...profile,
      uuid: uid,
      email,
    });
  }

  async authenticateWithGoogle(): Promise<AppUser> {
    const credential = await signInWithPopup(
      firebaseAuth,
      new GoogleAuthProvider(),
    );
    const appUser = this.toAppUser(credential.user);
    const existingProfile = await this.getUserProfile(appUser.uid);

    if (existingProfile) {
      return {
        ...appUser,
        ...existingProfile,
      };
    }

    const [name = null, ...lastNameParts] = (
      credential.user.displayName ?? ''
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const profile: UserProfile = {
      name,
      lastname: lastNameParts.join(' ') || null,
    };

    await this.addUserProfileToFirestore(
      appUser.uid,
      profile,
      credential.user.email,
    );

    return {
      ...appUser,
      ...profile,
    };
  }
}
