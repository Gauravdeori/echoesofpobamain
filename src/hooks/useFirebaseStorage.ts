import { useState, useCallback } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/integrations/firebase/firebase";

interface UploadState {
  progress: number;
  isUploading: boolean;
  downloadURL: string | null;
  error: string | null;
}

export function useFirebaseStorage() {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    downloadURL: null,
    error: null,
  });

  const uploadFile = useCallback(
    (file: File, path?: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const filePath =
          path || `posts/images/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        setUploadState({
          progress: 0,
          isUploading: true,
          downloadURL: null,
          error: null,
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadState((prev) => ({ ...prev, progress }));
          },
          (error) => {
            setUploadState({
              progress: 0,
              isUploading: false,
              downloadURL: null,
              error: error.message,
            });
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadState({
              progress: 100,
              isUploading: false,
              downloadURL: url,
              error: null,
            });
            resolve(url);
          }
        );
      });
    },
    []
  );

  const deleteFile = useCallback(async (fileUrl: string) => {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error: any) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }, []);

  const resetUploadState = useCallback(() => {
    setUploadState({
      progress: 0,
      isUploading: false,
      downloadURL: null,
      error: null,
    });
  }, []);

  return { ...uploadState, uploadFile, deleteFile, resetUploadState };
}
