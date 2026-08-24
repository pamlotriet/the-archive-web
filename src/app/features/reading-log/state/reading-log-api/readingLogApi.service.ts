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
import { firebaseAuth, firebaseFirestore } from '@core/data/firebase/firebase.config';
import type {
  CreateReadingLogEntryPayload,
  ReadingLogEntry,
  UpdateReadingLogEntryPayload,
} from '@features/reading-log/types/reading-log.types';

@Injectable({
  providedIn: 'root',
})
export class ReadingLogApiService {
  async loadReadingLogs(): Promise<ReadingLogEntry[]> {
    const logsCollection = await this.logsCollection();
    const snapshot = await getDocs(query(logsCollection, orderBy('startedAt', 'desc')));

    return snapshot.docs.map((logSnapshot) => this.mapReadingLog(logSnapshot));
  }

  async addReadingLog(log: CreateReadingLogEntryPayload): Promise<ReadingLogEntry> {
    const logsCollection = await this.logsCollection();
    const logRef = await addDoc(logsCollection, {
      ...this.logWriteData(log),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(logRef);

    return this.mapReadingLog(snapshot);
  }

  async updateReadingLog(log: UpdateReadingLogEntryPayload): Promise<ReadingLogEntry> {
    const { id, ...updates } = log;
    const logsCollection = await this.logsCollection();
    const logRef = doc(logsCollection, id);

    await updateDoc(logRef, {
      ...this.logWriteData(updates),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(logRef);

    return this.mapReadingLog(snapshot);
  }

  async deleteReadingLog(id: string): Promise<string> {
    const logsCollection = await this.logsCollection();

    await deleteDoc(doc(logsCollection, id));

    return id;
  }

  private async logsCollection() {
    await firebaseAuth.authStateReady();

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new Error('A signed-in user is required to manage reading logs.');
    }

    return collection(firebaseFirestore, 'users', uid, 'readingLogs');
  }

  private mapReadingLog(
    snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  ): ReadingLogEntry {
    const data = snapshot.data() ?? {};
    const startedAt = this.mapNumber(data['startedAt'], Date.now());
    const endedAt = this.mapNumber(data['endedAt'], startedAt);

    return {
      id: snapshot.id,
      itemId: this.mapString(data['itemId']),
      itemTitle: this.mapString(data['itemTitle'], 'Untitled item'),
      mode: data['mode'] === 'listening' ? 'listening' : 'reading',
      pages: this.mapNumber(data['pages']),
      minutes: Math.max(this.mapNumber(data['minutes']), 0),
      startedAt,
      endedAt,
      note: this.mapOptionalString(data['note']),
      createdAt: data['createdAt']?.toMillis?.() ?? null,
      updatedAt: data['updatedAt']?.toMillis?.() ?? null,
    };
  }

  private logWriteData(
    log: CreateReadingLogEntryPayload | Partial<CreateReadingLogEntryPayload>,
  ): Partial<CreateReadingLogEntryPayload> {
    return Object.fromEntries(
      Object.entries(log).filter(([, value]) => value !== undefined),
    ) as Partial<CreateReadingLogEntryPayload>;
  }

  private mapString(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
  }

  private mapOptionalString(value: unknown): string | undefined {
    return typeof value === 'string' && value ? value : undefined;
  }

  private mapNumber(value: unknown, fallback = 0): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  }
}
