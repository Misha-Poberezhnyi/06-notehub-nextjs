import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";
import type { NotesResponse } from "../../types/note";

export default async function NotesPage() {
  const initialData: NotesResponse = await fetchNotes("", 1);
  const safeInitialData = JSON.parse(JSON.stringify(initialData));

  return <NotesClient initialData={safeInitialData} />;
}
