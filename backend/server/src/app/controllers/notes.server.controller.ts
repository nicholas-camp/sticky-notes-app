import { Request, Response } from 'express';
import Logger from '../../config/logger';
import * as NoteModel from '../models/notes.server.model';

// Fetch all notes
const list = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('Fetching all notes');
    const notes = await NoteModel.list(); // Call model to fetch notes
    res.status(200).json(notes);
  } catch (error) {
    Logger.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// Create a new note
const create = async (req: Request, res: Response): Promise<void> => {
  try {
    Logger.info('Creating a new note');
    const { body, colors, position } = req.body;
    const newNote = await NoteModel.create({ body, colors, position }); // Call model to create note
    res.status(201).json(newNote);
  } catch (error) {
    Logger.error('Error creating note:', error);
    res.status(500).json({ message: 'Failed to create note' });
  }
};

const read = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validate and parse the note ID
    const noteId = parseInt(req.params.id, 10);
    if (isNaN(noteId)) {
      Logger.warn(`Invalid note ID: ${req.params.id}`);
      return res.status(400).json({ message: 'Invalid note ID' });
    }

    Logger.info(`Fetching note with ID: ${noteId}`);

    // Fetch the note using the model
    const note = await NoteModel.get(noteId);
    if (note) {
      Logger.info(`Note found for ID: ${noteId}`);
      res.status(200).json(note);
    } else {
      Logger.warn(`Note not found for ID: ${noteId}`);
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    Logger.error('Error fetching note:', error);
    res.status(500).json({ message: 'Failed to fetch note' });
  }
};

// Update an existing note
const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = parseInt(req.params.id, 10);
    const { body, colors, position } = req.body;

    Logger.info(`Updating note with ID: ${noteId}`);

    // Call model to update the note and get the affected rows
    const updateResult = await NoteModel.update(noteId, { body, colors, position });

    // Respond with the affected rows count
    res.status(200).json(updateResult); // Will include { affectedRows: number }
  } catch (error) {
    Logger.error('Error updating note:', error);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

// Delete a note by ID
const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteId = parseInt(req.params.id, 10);
    Logger.info(`Deleting note with ID: ${noteId}`);
    await NoteModel.remove(noteId); // Call model to delete note
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    Logger.error('Error deleting note:', error);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};

export { list, create, read, update, remove };