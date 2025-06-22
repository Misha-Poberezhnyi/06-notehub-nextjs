import axios from "axios";
import type { Note, CreateNotePayload } from "../types/note";
import { NotesResponse } from "../types/noteApi";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is not defined");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  search: string,
  page: number
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page };

  if (search.trim()) {
    params.search = search;
  }

  const response = await axiosInstance.get<NotesResponse>("", { params });
  return response.data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const payload = {
    title: note.title,
    content: note.content,
    tag: note.tag,
  };

  const response = await axiosInstance.post<Note>("", payload);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  const response = await axiosInstance.get<Note>(`/${id}`);
  return response.data;
};
