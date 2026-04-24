import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import NotePreviewClient from "./NotePreview.client";
import noteService from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => noteService.fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient noteId={id} />
    </HydrationBoundary>
  );
}
