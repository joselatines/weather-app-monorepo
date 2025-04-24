import express from 'express';
import { getWeather, getAutocomplete } from '../controllers/weather.controller';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.get('/', authenticate, getWeather);
router.get('/autocomplete', authenticate, getAutocomplete);

export default router;
