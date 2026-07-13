import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firebaseAuth, firebaseFirestore } from '../../../../core/data/firebase/firebase.config';
import type {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../../types/collection.types';
import type { CollectionsApiInterface } from './collectionsApi.interface';

@Injectable({
  providedIn: 'root',
})
export class CollectionsApiService implements CollectionsApiInterface {
  async loadCollections(): Promise<Collection[]> {
    const collectionsCollection = await this.collectionsCollection();
    const snapshot = await getDocs(query(collectionsCollection, orderBy('createdAt', 'desc')));

    return snapshot.docs.map((collectionSnapshot) => this.mapCollection(collectionSnapshot));
  }

  async addCollection(collectionPayload: CreateCollectionPayload): Promise<Collection> {
    const collectionsCollection = await this.collectionsCollection();
    const collectionRef = await addDoc(collectionsCollection, {
      ...this.collectionWriteData(collectionPayload),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(collectionRef);

    return this.mapCollection(snapshot);
  }

  async updateCollection(collectionPayload: UpdateCollectionPayload): Promise<Collection> {
    const { id, ...updates } = collectionPayload;
    const collectionsCollection = await this.collectionsCollection();
    const collectionRef = doc(collectionsCollection, id);

    await updateDoc(collectionRef, {
      ...this.collectionWriteData(updates),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(collectionRef);

    return this.mapCollection(snapshot);
  }

  async deleteCollection(id: string): Promise<string> {
    const collectionsCollection = await this.collectionsCollection();

    await deleteDoc(doc(collectionsCollection, id));

    return id;
  }

  private async collectionsCollection() {
    await firebaseAuth.authStateReady();

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new Error('A signed-in user is required to manage collections.');
    }

    return collection(firebaseFirestore, 'users', uid, 'collections');
  }

  private mapCollection(
    snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  ): Collection {
    const data = snapshot.data() ?? {};

    return {
      id: snapshot.id,
      name: this.mapString(data['name'], 'Untitled collection'),
      description: this.mapString(data['description']),
      color: this.mapString(data['color'], '#dca945'),
      createdAt: data['createdAt']?.toMillis?.() ?? null,
      updatedAt: data['updatedAt']?.toMillis?.() ?? null,
    };
  }

  private collectionWriteData(
    collectionPayload: CreateCollectionPayload | Partial<CreateCollectionPayload>,
  ): Partial<CreateCollectionPayload> {
    return Object.fromEntries(
      Object.entries(collectionPayload).filter(([, value]) => value !== undefined),
    ) as Partial<CreateCollectionPayload>;
  }

  private mapString(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
  }
}
