import express from 'express';
import { 
  getFavorites,
  addFavorite,
  deleteFavorite,
} from '../controllers/favorites.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/', authenticate, getFavorites);
router.post('/', authenticate, addFavorite);
router.delete('/:city', authenticate, deleteFavorite);

export default router;
