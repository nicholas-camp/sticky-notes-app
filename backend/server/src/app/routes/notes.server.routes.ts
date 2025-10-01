import { Express } from 'express';
import * as notes from '../controllers/notes.server.controller';

export default (app: Express): void => {
    app.route('/notes')
        .get(notes.list)   // GET all notes
        .post(notes.create); // POST to create a new note

    app.route('/notes/:id')
        .get(notes.read)    // GET a single note by ID
        .put(notes.update)  // PUT to update a note by ID
        .delete(notes.remove); // DELETE a note by ID
};