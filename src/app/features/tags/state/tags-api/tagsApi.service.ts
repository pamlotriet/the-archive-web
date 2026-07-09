import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { firebaseAuth, firebaseFirestore } from '../../../../core/data/firebase/firebase.config';
import type { CreateTagPayload, Tag, UpdateTagPayload } from '../../types/tag.types';
import type { TagsApiInterface } from './tagsApi.interface';

@Injectable({
  providedIn: 'root',
})
export class TagsApiService implements TagsApiInterface {
  async loadTags(): Promise<Tag[]> {
    const tagsCollection = await this.tagsCollection();
    const snapshot = await getDocs(query(tagsCollection, orderBy('createdAt', 'desc')));

    return snapshot.docs.map((tagSnapshot) => this.mapTag(tagSnapshot));
  }

  async addTag(tag: CreateTagPayload): Promise<Tag> {
    const tagsCollection = await this.tagsCollection();
    const tagRef = await addDoc(tagsCollection, {
      ...tag,
      count: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(tagRef);

    return this.mapTag(snapshot);
  }

  async updateTag(tag: UpdateTagPayload): Promise<Tag> {
    const { id, ...updates } = tag;
    const tagsCollection = await this.tagsCollection();
    const tagRef = doc(tagsCollection, id);

    await updateDoc(tagRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(tagRef);

    return this.mapTag(snapshot);
  }

  async deleteTag(id: string): Promise<string> {
    const tagsCollection = await this.tagsCollection();

    await deleteDoc(doc(tagsCollection, id));

    return id;
  }

  async incrementTagCount(id: string): Promise<string> {
    const tagsCollection = await this.tagsCollection();

    await updateDoc(doc(tagsCollection, id), {
      count: increment(1),
      updatedAt: serverTimestamp(),
    });

    return id;
  }

  private async tagsCollection() {
    await firebaseAuth.authStateReady();

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new Error('A signed-in user is required to manage tags.');
    }

    return collection(firebaseFirestore, 'users', uid, 'tags');
  }

  private mapTag(
    snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  ): Tag {
    const data = snapshot.data() ?? {};

    return {
      id: snapshot.id,
      name: data['name'] ?? '',
      color: data['color'] ?? '#11b981',
      count: this.mapCount(data['count']),
      createdAt: data['createdAt']?.toMillis?.() ?? null,
      updatedAt: data['updatedAt']?.toMillis?.() ?? null,
    };
  }

  private mapCount(count: unknown): number {
    return typeof count === 'number' && Number.isFinite(count) ? count : 0;
  }
}
