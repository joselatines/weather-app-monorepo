require('dotenv').config();
import { PrismaClient } from '../../generated/prisma';
import WeatherAPI from './WeatherAPI';

export const prisma = new PrismaClient();
prisma.$connect();

export const weatherAPI = new WeatherAPI();