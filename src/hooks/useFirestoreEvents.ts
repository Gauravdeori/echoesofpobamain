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

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  featuredImage?: string;
  status: "upcoming" | "past" | "draft";
  createdAt: Date;
  updatedAt: Date;
}

export type EventItemInput = Omit<EventItem, "id" | "createdAt" | "updatedAt">;

const COLLECTION = "events";

function docToEventItem(id: string, data: any): EventItem {
  return {
    id,
    title: data.title || "",
    description: data.description || "",
    date: data.date?.toDate?.() || new Date(),
    location: data.location || "",
    featuredImage: data.featuredImage || undefined,
    status: data.status || "upcoming",
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  };
}

async function fetchEvents(): Promise<EventItem[]> {
  const q = query(collection(db, COLLECTION), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToEventItem(d.id, d.data()));
}

async function fetchEvent(id: string): Promise<EventItem> {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("Event not found");
  return docToEventItem(snap.id, snap.data());
}

async function createEvent(input: EventItemInput): Promise<string> {
  const docData: any = {
    ...input,
    date: Timestamp.fromDate(input.date),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, COLLECTION), docData);
  return docRef.id;
}

async function updateEvent(
  id: string,
  input: Partial<EventItemInput>
): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  const docData: any = { ...input, updatedAt: serverTimestamp() };
  if (input.date !== undefined) {
    docData.date = Timestamp.fromDate(input.date);
  }
  await updateDoc(docRef, docData);
}

async function deleteEventById(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─── React Query Hooks ───────────────────────────────────────

export function useEvents() {
  return useQuery({
    queryKey: ["admin-events"],
    queryFn: fetchEvents,
    staleTime: 30_000,
  });
}

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-events", id],
    queryFn: () => fetchEvent(id!),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-events"] }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EventItemInput> }) =>
      updateEvent(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEventById,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-events"] }),
  });
}
