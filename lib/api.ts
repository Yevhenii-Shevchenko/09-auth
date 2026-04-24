import axios from "axios";
import type { Note, TAGS } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface DraftNote {
  title: string;
  content: string;
  tag: TAGS;
}

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

async function fetchNotes(
  page = 1,
  search?: string,
  tag?: TAGS,
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return data;
}

async function createNote(note: DraftNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

async function deleteNote(noteId: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${noteId}`);
  return data;
}

async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);

  return data;
}

const noteService = {
  fetchNotes,
  createNote,
  deleteNote,
  fetchNoteById,
};

export default noteService;
