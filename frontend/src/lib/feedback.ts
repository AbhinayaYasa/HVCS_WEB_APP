import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'feedback';

export interface FeedbackCreate {
  rating: number;
  name?: string;
  comment?: string;
  token?: string;
  issue_category?: string;
  follow_up_request?: boolean;
  initial_comment?: string;
}

export interface FeedbackDoc {
  id: string;
  rating: number;
  name?: string;
  comment?: string;
  token?: string;
  issue_category?: string;
  follow_up_request?: boolean;
  initial_comment?: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export async function createFeedback(data: FeedbackCreate): Promise<string> {
  const cleaned = Object.fromEntries(
    Object.entries({ ...data, createdAt: Timestamp.now() }).filter(
      ([, v]) => v !== undefined
    )
  ) as Record<string, unknown>;
  const docRef = await addDoc(collection(db, COLLECTION), cleaned);
  return docRef.id;
}

export async function listFeedback(): Promise<FeedbackDoc[]> {
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
    } as FeedbackDoc;
  });
}
