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
import type { CreateNotePayload, Note, UpdateNotePayload } from '@features/notes/types/note.types';

@Injectable({
  providedIn: 'root',
})
export class NotesApiService {
  async loadNotes(): Promise<Note[]> {
    const notesCollection = await this.notesCollection();
    const snapshot = await getDocs(query(notesCollection, orderBy('updatedAt', 'desc')));

    return snapshot.docs.map((noteSnapshot) => this.mapNote(noteSnapshot));
  }

  async addNote(note: CreateNotePayload): Promise<Note> {
    const notesCollection = await this.notesCollection();
    const noteRef = await addDoc(notesCollection, {
      ...this.noteWriteData(note),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const snapshot = await getDoc(noteRef);

    return this.mapNote(snapshot);
  }

  async updateNote(note: UpdateNotePayload): Promise<Note> {
    const { id, ...updates } = note;
    const notesCollection = await this.notesCollection();
    const noteRef = doc(notesCollection, id);

    await updateDoc(noteRef, {
      ...this.noteWriteData(updates),
      updatedAt: serverTimestamp(),
    });

    const snapshot = await getDoc(noteRef);

    return this.mapNote(snapshot);
  }

  async deleteNote(id: string): Promise<string> {
    const notesCollection = await this.notesCollection();

    await deleteDoc(doc(notesCollection, id));

    return id;
  }

  private async notesCollection() {
    await firebaseAuth.authStateReady();

    const uid = firebaseAuth.currentUser?.uid;

    if (!uid) {
      throw new Error('A signed-in user is required to manage notes.');
    }

    return collection(firebaseFirestore, 'users', uid, 'notes');
  }

  private mapNote(
    snapshot: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>,
  ): Note {
    const data = snapshot.data() ?? {};

    return {
      id: snapshot.id,
      title: this.mapString(data['title'], 'Untitled note'),
      body: this.mapString(data['body']),
      tags: Array.isArray(data['tags'])
        ? data['tags'].filter((tag) => typeof tag === 'string')
        : [],
      itemId: this.mapOptionalString(data['itemId']),
      pinned: data['pinned'] === true,
      createdAt: data['createdAt']?.toMillis?.() ?? null,
      updatedAt: data['updatedAt']?.toMillis?.() ?? null,
    };
  }

  private noteWriteData(
    note: CreateNotePayload | Partial<CreateNotePayload>,
  ): Partial<CreateNotePayload> {
    return Object.fromEntries(
      Object.entries(note).filter(([, value]) => value !== undefined),
    ) as Partial<CreateNotePayload>;
  }

  private mapString(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback;
  }

  private mapOptionalString(value: unknown): string | undefined {
    return typeof value === 'string' && value ? value : undefined;
  }
}
