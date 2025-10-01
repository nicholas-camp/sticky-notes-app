import { useRef, useEffect, useState, useContext } from "react";
import Spinner from "../icons/Spinner";
import { setNewOffset, autoGrow, setZIndex } from "../utils";
import DeleteButton from "./DeleteButton";
import { NoteContext } from "../context/NoteContext";
import { Note } from "../types";
import api from '../api/axios';

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const [position, setPosition] = useState(note.position);
  const [body, setBody] = useState(note.body);
  const [saving, setSaving] = useState(false);
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error("NoteContext must be used within a NotesProvider");
  }

  const { setNotes, setSelectedNote } = noteContext;
  const colors = note.colors;

  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const keyUpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetSavingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Select the note when it mounts
  useEffect(() => {
    setSelectedNote(note);
  }, [note, setSelectedNote]);

  useEffect(() => {
    if (textAreaRef.current) autoGrow(textAreaRef);
    if (cardRef.current) setZIndex(cardRef.current);
  }, []);

  const updateNote = async (updatedFields: Partial<Note>) => {
    try {
      await api.put(`/notes/${note.id}`, updatedFields);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const updatePosition = (newPosition: { x: number; y: number }) => {
    setPosition(newPosition);
    updateNote({ position: newPosition });
  };

  const mouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    if (cardRef.current) setZIndex(cardRef.current);

    setSelectedNote(note);
  };

  const mouseMove = (e: MouseEvent) => {
    const mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    if (cardRef.current) {
      const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
      updatePosition(newPosition);
    }
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  };

  const handleKeyUp = () => {
    if (keyUpTimer.current) clearTimeout(keyUpTimer.current);

    keyUpTimer.current = setTimeout(async () => {
      setSaving(true);
      await updateNote({ body });
      resetSavingTimer.current = setTimeout(() => setSaving(false), 2000);
    }, 2000);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: colors.colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <div className="card-header-left">
          <DeleteButton noteId={note.id} />
        </div>
        <div className="card-header-right">
          {saving && (
            <div className="card-saving">
              <Spinner color={colors.colorText} />
              <span style={{ color: colors.colorText }}>Saving...</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <textarea
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          value={body}
          onChange={handleBodyChange}
          onKeyUp={handleKeyUp}
          onInput={() => autoGrow(textAreaRef)}
          onFocus={() => {
            if (cardRef.current) setZIndex(cardRef.current);
            setSelectedNote(note);
          }}
        />
      </div>
    </div>
  );
};

export default NoteCard;
