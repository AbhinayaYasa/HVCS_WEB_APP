import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

const GALLERY_PREFIX = 'gallery';

export async function uploadGalleryImage(
  file: File,
  pathSegment: string
): Promise<{ url: string; storagePath: string }> {
  const ext = file.name.split('.').pop() || 'jpg';
  const storagePath = `${GALLERY_PREFIX}/${pathSegment}.${ext}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, storagePath };
}

export async function deleteGalleryImage(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
