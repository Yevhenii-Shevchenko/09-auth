import { createNote as createNoteRequest } from "@/lib/api/clientApi";
import type { DraftNote } from "@/lib/api/clientApi";

async function createNote(note: DraftNote) {
  return createNoteRequest(note);
}

export default createNote;
