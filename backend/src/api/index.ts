import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import authRoutes from './routes/auth.route';
import weatherRoutes from './routes/weather.route';
import favoritesRoutes from './routes/favorites.route';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', authRoutes);
router.use('/weather', weatherRoutes);
router.use('/favorites', favoritesRoutes);


export default router;
