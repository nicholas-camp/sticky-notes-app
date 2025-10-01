import React, { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import api from '../api/axios';

interface ColorProps {
  color: {
    id: string;
    colorHeader: string;
    colorBody: string;
    colorText: string;
  };
}

function Color({ color }: ColorProps) {
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error("NoteContext must be used within a NotesProvider");
  }

  const { selectedNote, setNotes } = noteContext;

  const changeColor = async () => {
    if (!selectedNote) {
      console.log("No note selected!");
      return;
    }

    try {
      const updatedNote = { ...selectedNote, colors: color };
      await api.put(`/notes/${selectedNote.id}`, updatedNote); // <- uses baseURL

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNote.id ? updatedNote : note
        )
      );

      console.log("Selected color updated for note:", updatedNote);
    } catch (error) {
      console.error("Failed to update color:", error);
    }
  };

  return (
    <div
      onClick={changeColor}
      className="color"
      style={{ backgroundColor: color.colorHeader }}
    ></div>
  );
}

export default Color;
