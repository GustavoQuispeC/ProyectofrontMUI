import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

export type StorageFolder = "empleados" | "productos";

interface UploadResult {
  url: string;
  path: string;
}

interface UseFirebaseStorageReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, folder: StorageFolder) => Promise<UploadResult | null>;
  deleteFile: (path: string) => Promise<boolean>;
}

export function useFirebaseStorage(): UseFirebaseStorageReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = (file: File, folder: StorageFolder): Promise<UploadResult | null> => {
    return new Promise((resolve) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err: Error) => {
          console.error("Error al subir archivo:", err);
          setError("Error al subir la imagen. Intenta de nuevo.");
          setUploading(false);
          resolve(null);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          setProgress(100);
          resolve({ url, path: filePath });
        }
      );
    });
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      return true;
    } catch (err: unknown) {
      console.error("Error al eliminar archivo:", err);
      return false;
    }
  };

  return { uploading, progress, error, uploadFile, deleteFile };
}