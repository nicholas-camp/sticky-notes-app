import React, { useContext } from "react";
import Trash from "../icons/Trash";
import { NoteContext } from "../context/NoteContext";
import api from '../api/axios';

interface DeleteButtonProps {
  noteId: number;
}

const DeleteButton = ({ noteId }: DeleteButtonProps) => {
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error("NoteContext must be used within a NotesProvider");
  }

  const { setNotes } = noteContext;

  const handleDelete = async () => {
    try {
      await api.delete(`/notes/${noteId}`);
      // Update context state by filtering out the deleted note
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "transparent", // Makes the background invisible
        border: "none",            // Removes the border
      }}
    >
      <Trash />
    </button>
  );
};

export default DeleteButton;
