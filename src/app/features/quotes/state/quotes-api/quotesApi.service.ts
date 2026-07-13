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
import type { CreateQuotePayload, Quote, UpdateQuotePayload } from '../../types/quote.types';

@Injectable({
  providedIn: 'root',
})
export class QuotesApiService {
  async loadQuotes(): Promise<Quote[]> {
    const quotesCollection = await this.quotesCollection();
    const snapshot = await getDocs(query(quotesCollection, orderBy('createdAt', 'desc')));

    return snapshot.docs.map((quoteSnapshot) => this.mapQuote(quoteSnapshot));
  }

  async addQuote(quote: CreateQuotePayload): Promise<Quote> {
    const quotesCollection = await this.quotesCollection();
    const quoteRef = await addDoc(quotesCollection, {
      ...this.quoteWriteData(quote),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(quoteRef);

    return this.mapQuote(snapshot);
  }

  async updateQuote(quote: UpdateQuotePayload): Promise<Quote> {
    const { id, ...updates } = quote;
    const quotesCollection = await this.quotesCollection();
    const quoteRef = doc(quotesCollection, id);

    await updateDoc(quoteRef, {
      ...this.quoteWriteData(updates),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(quoteRef);

    return this.mapQuote(snapshot);
  }

  async deleteQuote(id: string): Promise<string> {
    const quotesCollection = await this.quotesCollection();

    await deleteDoc(doc(quotesCollection, id));

    return id;
  }

  private async quotesCollection() {
    await firebaseAuth.authStateReady();

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new Error('A signed-in user is required to manage quotes.');
    }

    return collection(firebaseFirestore, 'users', uid, 'quotes');
  }

  private mapQuote(
    snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  ): Quote {
    const data = snapshot.data() ?? {};

    return {
      id: snapshot.id,
      text: this.mapString(data['text']),
      author: this.mapString(data['author']),
      source: this.mapString(data['source']),
      itemId: this.mapOptionalString(data['itemId']),
      note: this.mapOptionalString(data['note']),
      favorite: data['favorite'] === true,
      createdAt: data['createdAt']?.toMillis?.() ?? null,
      updatedAt: data['updatedAt']?.toMillis?.() ?? null,
    };
  }

  private quoteWriteData(
    quote: CreateQuotePayload | Partial<CreateQuotePayload>,
  ): Partial<CreateQuotePayload> {
    return Object.fromEntries(
      Object.entries(quote).filter(([, value]) => value !== undefined),
    ) as Partial<CreateQuotePayload>;
  }

  private mapString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private mapOptionalString(value: unknown): string | undefined {
    return typeof value === 'string' && value ? value : undefined;
  }
}
