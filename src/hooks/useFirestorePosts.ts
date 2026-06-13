import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/integrations/firebase/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Post {
  id: string;
  title: string;
  content: string;
  category: "news" | "event" | "update" | "announcement";
  status: "draft" | "published" | "scheduled";
  featuredImage?: string;
  videoUrl?: string;
  scheduledAt?: Date | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorEmail: string;
}

export type PostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

const COLLECTION = "posts";

function docToPost(id: string, data: any): Post {
  return {
    id,
    title: data.title || "",
    content: data.content || "",
    category: data.category || "update",
    status: data.status || "draft",
    featuredImage: data.featuredImage || undefined,
    videoUrl: data.videoUrl || undefined,
    scheduledAt: data.scheduledAt?.toDate?.() || null,
    publishedAt: data.publishedAt?.toDate?.() || null,
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
    authorId: data.authorId || "",
    authorEmail: data.authorEmail || "",
  };
}

async function fetchPosts(): Promise<Post[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToPost(d.id, d.data()));
}

async function fetchPost(id: string): Promise<Post> {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Post not found");
  return docToPost(snap.id, snap.data());
}

async function createPost(input: PostInput): Promise<string> {
  const docData: any = {
    ...input,
    scheduledAt: input.scheduledAt ? Timestamp.fromDate(input.scheduledAt) : null,
    publishedAt: input.publishedAt ? Timestamp.fromDate(input.publishedAt) : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, COLLECTION), docData);
  return docRef.id;
}

async function updatePost(
  id: string,
  input: Partial<PostInput>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const docData: any = { ...input, updatedAt: serverTimestamp() };
  if (input.scheduledAt !== undefined) {
    docData.scheduledAt = input.scheduledAt
      ? Timestamp.fromDate(input.scheduledAt)
      : null;
  }
  if (input.publishedAt !== undefined) {
    docData.publishedAt = input.publishedAt
      ? Timestamp.fromDate(input.publishedAt)
      : null;
  }
  await updateDoc(docRef, docData);
}

async function deletePostById(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─── React Query Hooks ───────────────────────────────────────

export function usePosts() {
  return useQuery({
    queryKey: ["admin-posts"],
    queryFn: fetchPosts,
    staleTime: 30_000,
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-posts", id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["published-posts"] });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PostInput> }) =>
      updatePost(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["published-posts"] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePostById,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      qc.invalidateQueries({ queryKey: ["published-posts"] });
    },
  });
}

async function fetchPublishedPosts(): Promise<Post[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const allPosts = snapshot.docs.map((d) => docToPost(d.id, d.data()));
  // Safe in-memory filter to prevent composite index errors
  return allPosts.filter((post) => post.status === "published");
}

export function usePublishedPosts() {
  return useQuery({
    queryKey: ["published-posts"],
    queryFn: fetchPublishedPosts,
    staleTime: 30_000,
  });
}
