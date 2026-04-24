import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

import noteService from "@/lib/api";
import NotesClient from "./Notes.client";
import { TAGS } from "@/types/note";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  const title =
    tag === "all" ? "All Notes | NoteHub" : `${tag} Notes | NoteHub`;

  const description =
    tag === "all"
      ? "Browse all your notes in NoteHub."
      : `Browse ${tag} notes in NoteHub.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-red-tau.vercel.app/notes/${tag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Open Graph Image",
        },
      ],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;

  const tagValue = slug?.[0];
  const activeTag = !tagValue || tagValue === "all" ? undefined : tagValue;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", activeTag],
    queryFn: () =>
      noteService.fetchNotes(
        1,
        "",
        activeTag && activeTag !== "all" ? (activeTag as TAGS) : undefined,
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient activeTag={activeTag} />
    </HydrationBoundary>
  );
}
