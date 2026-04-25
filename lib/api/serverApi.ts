import type { AxiosResponse } from "axios";

import { api } from "./api";
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

function getServerRequestConfig(cookies: string) {
  return {
    baseURL: getServerApiBaseUrl(),
    headers: {
      Cookie: cookies,
    },
  };
}

export async function fetchNotes(
  options: ServerRequestOptions,
  page = 1,
  search?: string,
  tag?: TAGS,
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    ...getServerRequestConfig(options.cookies),
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
  const { data } = await api.get<Note>(
    `/notes/${id}`,
    getServerRequestConfig(options.cookies),
  );
  return data;
}

export async function checkSession(
  options: ServerRequestOptions,
): Promise<AxiosResponse<{ success: boolean }>> {
  return api.get<{ success: boolean }>(
    "/auth/session",
    getServerRequestConfig(options.cookies),
  );
}

export async function getMe(options: ServerRequestOptions): Promise<User> {
  const { data } = await api.get<User>(
    "/users/me",
    getServerRequestConfig(options.cookies),
  );
  return data;
}
