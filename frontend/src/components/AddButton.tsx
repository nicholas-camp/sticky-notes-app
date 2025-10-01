import { useRef, useContext } from "react";
import Plus from "../icons/Plus";
import colorsJson from "../assets/colors.json";
import { NoteContext } from "../context/NoteContext";
import type { Colors, Note, Position } from '../types';
import api from '../api/axios';

const AddButton = () => {
  const startingPos = useRef(10);
  const noteContext = useContext(NoteContext);

  if (!noteContext) {
    throw new Error("NoteContext must be used within a NotesProvider");
  }

  const { setNotes } = noteContext;

  const colors: Colors[] = colorsJson as Colors[];

  const addNote = async () => {
    try {
      const payload = {
        position: {
          x: startingPos.current,
          y: startingPos.current,
        } as Position,
        colors: colors[0],
        body: "",
      };

      const response = await api.post("/notes", payload); // <- uses baseURL

      startingPos.current += 10;
      const newNote: Note = response.data;
      setNotes((prevNotes) => [...prevNotes, newNote]);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div id="add-btn" onClick={addNote}>
      <Plus />
    </div>
  );
};

export default AddButton;
