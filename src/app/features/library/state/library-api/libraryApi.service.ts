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
import type { CreateItemPayload, Item, UpdateItemPayload } from '../../types/item.types';
import type { LibraryApiInterface } from './libraryApi.interface';

@Injectable({
  providedIn: 'root',
})
export class LibraryApiService implements LibraryApiInterface {
  private readonly fallbackImageUrl = '/assets/images/library-login-background.png';

  async loadItems(): Promise<Item[]> {
    const itemsCollection = await this.itemsCollection();
    const snapshot = await getDocs(query(itemsCollection, orderBy('createdAt', 'desc')));

    return snapshot.docs.map((itemSnapshot) => this.mapItem(itemSnapshot));
  }

  async addItem(item: CreateItemPayload): Promise<Item> {
    const itemsCollection = await this.itemsCollection();
    const itemRef = await addDoc(itemsCollection, {
      ...this.itemWriteData(item),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(itemRef);

    return this.mapItem(snapshot);
  }

  async updateItem(item: UpdateItemPayload): Promise<Item> {
    const { id, ...updates } = item;
    const itemsCollection = await this.itemsCollection();
    const itemRef = doc(itemsCollection, id);

    await updateDoc(itemRef, {
      ...this.itemWriteData(updates),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(itemRef);

    return this.mapItem(snapshot);
  }

  async deleteItem(id: string): Promise<string> {
    const itemsCollection = await this.itemsCollection();

    await deleteDoc(doc(itemsCollection, id));

    return id;
  }

  private async itemsCollection() {
    await firebaseAuth.authStateReady();

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new Error('A signed-in user is required to manage library items.');
    }

    return collection(firebaseFirestore, 'users', uid, 'items');
  }

  private mapItem(
    snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  ): Item {
    const data = snapshot.data() ?? {};

    return {
      id: snapshot.id,
      title: this.mapString(data['title'], 'Untitled'),
      description: this.mapString(data['description']),
      category: data['category'] ?? 'books',
      imageUrl: this.mapImageUrl(data['imageUrl']),
      sourceUrl: this.mapSourceUrl(data['sourceUrl']),
      author: this.mapString(data['author']),
      producer: this.mapString(data['producer']),
      rating: this.mapNumber(data['rating']),
      status: data['status'] ?? 'wantToRead',
      progress: this.mapNumber(data['progress']),
      currentPage: this.mapOptionalNumber(data['currentPage']),
      totalPages: this.mapOptionalNumber(data['totalPages']),
      tags: Array.isArray(data['tags']) ? data['tags'].filter((tag) => typeof tag === 'string') : [],
      note: this.mapString(data['note']),
      createdAt: data['createdAt']?.toMillis?.() ?? null,
      updatedAt: data['updatedAt']?.toMillis?.() ?? null,
    };
  }

  private mapString(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
  }

  private mapImageUrl(value: unknown): string {
    const imageUrl = this.mapString(value).trim();

    if (!imageUrl) {
      return this.fallbackImageUrl;
    }

    if (imageUrl.startsWith('/') || /^https?:\/\//i.test(imageUrl)) {
      return imageUrl;
    }

    return `https://${imageUrl}`;
  }

  private mapSourceUrl(value: unknown): string | undefined {
    const sourceUrl = this.mapString(value).trim();

    if (!sourceUrl) {
      return undefined;
    }

    if (/^https?:\/\//i.test(sourceUrl)) {
      return sourceUrl;
    }

    return `https://${sourceUrl}`;
  }

  private mapNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  private mapOptionalNumber(value: unknown): number | undefined {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
  }

  private itemWriteData(
    item: CreateItemPayload | Partial<CreateItemPayload>,
  ): Partial<CreateItemPayload> {
    const itemData = { ...item };

    if (itemData.imageUrl !== undefined) {
      itemData.imageUrl = this.mapImageUrl(itemData.imageUrl);
    }

    if (itemData.sourceUrl !== undefined) {
      itemData.sourceUrl = this.mapSourceUrl(itemData.sourceUrl);
    }

    return this.removeUndefinedFields(itemData);
  }

  private removeUndefinedFields<T extends Record<string, unknown>>(value: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined),
    ) as Partial<T>;
  }
}
