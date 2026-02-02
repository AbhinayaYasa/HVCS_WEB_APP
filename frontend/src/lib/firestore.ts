import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { GalleryItem, GalleryItemCreate } from '../types/gallery';

const COLLECTION = 'galleryItems';

export async function listGalleryItems(): Promise<GalleryItem[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt as Timestamp;
    return {
      id: d.id,
      ...data,
      createdAt: ts?.seconds != null
        ? { seconds: ts.seconds, nanoseconds: ts.nanoseconds ?? 0 }
        : data.createdAt,
    } as GalleryItem;
  });
}

export async function listFeaturedItems(count: number = 6): Promise<GalleryItem[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    const ts = data.createdAt as Timestamp;
    return {
      id: d.id,
      ...data,
      createdAt: ts?.seconds != null
        ? { seconds: ts.seconds, nanoseconds: ts.nanoseconds ?? 0 }
        : data.createdAt,
    } as GalleryItem;
  });
}

export async function createGalleryItem(data: GalleryItemCreate): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
