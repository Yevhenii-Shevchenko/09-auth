"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { fetchNoteById } from "@/lib/api/clientApi";
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
    queryFn: () => fetchNoteById(id),
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
