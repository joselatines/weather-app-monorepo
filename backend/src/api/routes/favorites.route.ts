import express from 'express';
import { 
  getFavorites,
  addFavorite,
  deleteFavorite,
} from '../controllers/favorites.controller';

const router = express.Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:city', deleteFavorite);

export default router;
