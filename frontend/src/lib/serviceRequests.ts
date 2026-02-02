import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { ServiceRequestCreate } from '../types/serviceRequest';

const COLLECTION = 'serviceRequests';

export async function createServiceRequest(data: ServiceRequestCreate): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}
