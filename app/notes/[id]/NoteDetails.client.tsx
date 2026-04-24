"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import noteService from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

interface NoteDetailsClientProps {
  id: string;
}

function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => noteService.fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return null;
  if (error || !note) return null;

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview note={note} />
    </Modal>
  );
}

export default NoteDetailsClient;
