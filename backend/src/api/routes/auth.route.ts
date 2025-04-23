import express from 'express';
import { authIndex } from '../controllers/auth.controller';

const router = express.Router();


router.get('/', authIndex);

export default router;
