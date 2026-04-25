import type { AxiosError } from "axios";

import { api } from "./api";
import type { Note, TAGS } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface DraftNote {
  title: string;
  content: string;
  tag: TAGS;
}

interface Credentials {
  email: string;
  password: string;
}

interface UpdateMePayload {
  username: string;
}

interface SessionResponse {
  success: boolean;
}

interface ApiErrorPayload {
  error?: string;
  response?: {
    message?: string;
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiErrorPayload>;

  return (
    axiosError.response?.data?.response?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    fallback
  );
}

export async function fetchNotes(
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

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: DraftNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(credentials: Credentials): Promise<User> {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
}

export async function login(credentials: Credentials): Promise<User> {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<SessionResponse>("/auth/session");
  return data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(payload: UpdateMePayload): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
