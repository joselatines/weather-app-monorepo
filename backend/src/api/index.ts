import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import authRoutes from './routes/auth.route';
import weatherRoutes from './routes/weather.route';
import favoritesRoutes from './routes/favorites.route';
import expressCache from "cache-express";

const router = express.Router();
const cacheConfig = {
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
}

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});



router.use('/auth', authRoutes);
router.use('/weather', expressCache(cacheConfig), weatherRoutes);
router.use('/favorites', favoritesRoutes);


export default router;
