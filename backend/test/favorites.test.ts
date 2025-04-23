import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/services';
// TODO: Fix test to create a new user this will be with the JWT
describe('Favorites API', () => {
  const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

  beforeEach(async () => {
    // Clear favorites before each test
    await prisma.favorite_cities.deleteMany();
  });

  describe('GET /api/v1/favorites', () => {
    it('returns empty array when no favorites exist', async () => {
      const response = await request(app)
        .get('/api/v1/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body).toHaveProperty('message');
    });

    it('returns existing favorites', async () => {
      // Add test data
      await prisma.favorite_cities.create({
        data: {
          city_name: 'Paris',
          user_id: DEFAULT_USER_ID,
        },
      });

      const response = await request(app)
        .get('/api/v1/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toContain('Paris');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/favorites', () => {
    it('adds a new favorite', async () => {
      const newCity = 'Berlin';
      const response = await request(app)
        .post('/api/v1/favorites')
        .send({ city: newCity })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data.city_name).toContain(newCity);
      expect(response.body).toHaveProperty('message');

      // Verify it was actually added to DB
      const dbEntry = await prisma.favorite_cities.findFirst({
        where: { city_name: newCity },
      });
      expect(dbEntry).toBeTruthy();
    });

    it('returns 400 when city is missing', async () => {
      await request(app)
        .post('/api/v1/favorites')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400);
    });
  });

  describe('DELETE /api/v1/favorites/:city', () => {
    it('removes a favorite', async () => {
      // First add a city to delete
      await prisma.favorite_cities.create({
        data: {
          city_name: 'Paris',
          user_id: DEFAULT_USER_ID,
        },
      });

      const response = await request(app)
        .delete('/api/v1/favorites/Paris')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).not.toContain('Paris');
      expect(response.body).toHaveProperty('message');

      // Verify it was actually removed from DB
      const dbEntry = await prisma.favorite_cities.findFirst({
        where: { city_name: 'Paris' },
      });
      expect(dbEntry).toBeNull();
    });
  });
});
