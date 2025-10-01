import express from 'express';
import bodyParser from 'body-parser';
import notesRoutes from '../app/routes/notes.server.routes';

export default () => {
    const app = express();

    // Enable CORS
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    });

    // Parse JSON bodies
    app.use(bodyParser.json());

    // Mount routes
    
    notesRoutes(app);

    return app;
};
