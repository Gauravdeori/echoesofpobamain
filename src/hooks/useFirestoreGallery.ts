import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "Nature" | "Our Work" | "Events" | "Recognition";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type GalleryItemInput = Omit<GalleryItem, "id" | "createdAt" | "updatedAt">;

const COLLECTION = "gallery";

function docToGalleryItem(id: string, data: any): GalleryItem {
  return {
    id,
    src: data.src || "",
    alt: data.alt || "",
    category: data.category || "Nature",
    order: typeof data.order === "number" ? data.order : 0,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  };
}

async function fetchGallery(): Promise<GalleryItem[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("order", "asc"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToGalleryItem(d.id, d.data()));
}

async function createGalleryItem(input: GalleryItemInput): Promise<string> {
  const docData: any = {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, COLLECTION), docData);
  return docRef.id;
}

async function updateGalleryItem(
  id: string,
  input: Partial<GalleryItemInput>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const docData: any = { ...input, updatedAt: serverTimestamp() };
  await updateDoc(docRef, docData);
}

async function deleteGalleryItemById(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─── React Query Hooks ───────────────────────────────────────

export function useGallery() {
  return useQuery({
    queryKey: ["admin-gallery"],
    queryFn: fetchGallery,
    staleTime: 30_000,
  });
}

export function useCreateGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });
}

export function useUpdateGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItemInput> }) =>
      updateGalleryItem(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });
}

export function useDeleteGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGalleryItemById,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-gallery"] }),
  });
}
