import React, { useContext } from "react";
import NoteCard from "../components/NoteCard";
import { NoteContext } from "../context/NoteContext";
import Controls from "../components/Controls";

const NotesPage = () => {
	// Access the context
	const noteContext = useContext(NoteContext);

	if (!noteContext) {
		throw new Error("NoteContext must be used within a NotesProvider");
	}

	const { notes } = noteContext;

	return (
		<div>
			{notes.map((note) => (
				<NoteCard key={note.id} note={note} />
			))}
			<Controls />
		</div>
	);
};

export default NotesPage;
