import { createContext, useState, useEffect, ReactNode } from "react";
import Spinner from "../icons/Spinner";
import { Note } from "../types";
import api from '../api/axios';


interface NoteContextType {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  selectedNote: Note | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
}

export const NoteContext = createContext<NoteContextType | null>(null);

interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <NoteContext.Provider value={{ notes, setNotes, selectedNote, setSelectedNote }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner size={100} />
        </div>
      ) : (
        children
      )}
    </NoteContext.Provider>
  );
};

export default NotesProvider;
