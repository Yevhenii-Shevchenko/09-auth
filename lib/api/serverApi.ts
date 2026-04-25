import axios from "axios";

import type { Note, TAGS } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesResponse } from "./clientApi";

interface ServerRequestOptions {
  cookies: string;
}

function getServerApiBaseUrl() {
  const publicApiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const projectProductionOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined;
  const deploymentOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  const origin =
    publicApiOrigin || projectProductionOrigin || deploymentOrigin;

  if (!origin) {
    throw new Error("Missing API origin for server requests");
  }

  return `${origin}/api`;
}

function createServerApi(cookies: string) {
  return axios.create({
    baseURL: getServerApiBaseUrl(),
    withCredentials: true,
    headers: {
      Cookie: cookies,
    },
  });
}

export async function fetchNotes(
  options: ServerRequestOptions,
  page = 1,
  search?: string,
  tag?: TAGS,
): Promise<FetchNotesResponse> {
  const serverApi = createServerApi(options.cookies);
  const { data } = await serverApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return data;
}

export async function fetchNoteById(
  id: string,
  options: ServerRequestOptions,
): Promise<Note> {
  const serverApi = createServerApi(options.cookies);
  const { data } = await serverApi.get<Note>(`/notes/${id}`);
  return data;
}

export async function checkSession(
  options: ServerRequestOptions,
): Promise<boolean> {
  const serverApi = createServerApi(options.cookies);
  const { data } = await serverApi.get<{ success: boolean }>("/auth/session");
  return data.success;
}

export async function getMe(options: ServerRequestOptions): Promise<User> {
  const serverApi = createServerApi(options.cookies);
  const { data } = await serverApi.get<User>("/users/me");
  return data;
}
