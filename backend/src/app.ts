import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();
import expressCache from "cache-express";

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', expressCache({
    timeOut: 60000, // Cache for 1 minute
    onTimeout: (key: string) => {
        const now = new Date();
        const colors = {
            reset: '\x1b[0m',
            cyan: '\x1b[36m',
            yellow: '\x1b[33m',
            magenta: '\x1b[35m'
        };
        console.log(
            `${colors.cyan}[CACHE]${colors.reset} ${now.toISOString()} - ` +
            `${colors.yellow}Cache entry expired${colors.reset} for key: ${colors.magenta}${key}${colors.reset}`
        );
    },
}), api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
