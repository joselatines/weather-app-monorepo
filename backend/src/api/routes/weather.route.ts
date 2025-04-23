import express from 'express';
import { getWeather, getAutocomplete } from '../controllers/weather.controller';

const router = express.Router();

router.get('/', getWeather);
router.get('/autocomplete', getAutocomplete);

export default router;
