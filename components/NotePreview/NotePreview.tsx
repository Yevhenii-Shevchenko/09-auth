import { Note } from "@/types/note";
import css from "./NotePreview.module.css";

interface Props {
  note: Note;
}

export default function NotePreview({ note }: Props) {
  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2 className={css.title}>{note.title}</h2>
        </div>
        {note.tag && <span className={css.tag}>{note.tag}</span>}
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
