import { connect } from './config/db';
import express from './config/express';
import Logger from './config/logger'
const app = express();

async function main() {
    try {
        await connect();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            Logger.info(`Notes app server running on http://localhost:${port}`);
        });
    } catch (err) {
        Logger.error('Failed to start the server.');
        process.exit(1);
    }
}

main().catch((err) => Logger.error(err));