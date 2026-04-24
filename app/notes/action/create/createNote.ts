import noteService from "@/lib/api";
import type { DraftNote } from "@/lib/api";

async function createNote(note: DraftNote) {
  return noteService.createNote(note);
}

export default createNote;
