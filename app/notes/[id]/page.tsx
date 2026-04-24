import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";

import noteService from "@/lib/api";

import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const note = await noteService.fetchNoteById(id);

  return {
    title: `${note.title} | NoteHub`,
    description: note.content?.slice(0, 150) || "Note details page",
    openGraph: {
      title: note.title,
      description: note.content?.slice(0, 150) || "Note details page",
      url: `https://08-zustand-red-tau.vercel.app/notes/${note.id}`,
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

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => noteService.fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
