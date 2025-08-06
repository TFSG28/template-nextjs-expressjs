import app from './app';
import 'dotenv/config';
import logger from './lib/logger';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server started successfully`, { metadata: { port: PORT, environment: process.env.NODE_ENV || 'development' } });
});