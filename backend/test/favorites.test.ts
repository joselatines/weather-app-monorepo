import request from 'supertest';
import app from '../src/app';

describe('Favorites API', () => {
  describe('GET /api/v1/favorites', () => {
    it('returns favorites with correct structure', async () => {
      const response = await request(app)
        .get('/api/v1/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
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

      expect(response.body.data).toContain(newCity);
      expect(response.body).toHaveProperty('message');
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
      const cityToRemove = 'Paris';
      const response = await request(app)
        .delete(`/api/v1/favorites/${cityToRemove}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).not.toContain(cityToRemove);
      expect(response.body).toHaveProperty('message');
    });
  });
});
