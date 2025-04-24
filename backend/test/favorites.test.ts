import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/services';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config';

describe('Favorites API', () => {
  let testUserId: string;
  let authToken: string;
  const TEST_PASSWORD = 'testpassword123';

  beforeEach(async () => {
    // Create a unique test user for this test run
    const testUser = await prisma.users.create({
      data: {
        username: `testuser-${Date.now()}`,
        password_hash: TEST_PASSWORD,
      }
    });
    testUserId = testUser.user_id;
    
    // Generate JWT for the test user
    authToken = jwt.sign(
      { user_id: testUserId, username: testUser.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterEach(async () => {
    // Delete the test user (cascades to their favorites)
    await prisma.users.delete({
      where: { user_id: testUserId }
    });
  });

  describe('GET /api/v1/favorites', () => {
    it('returns empty array when no favorites exist', async () => {
      const response = await request(app)
        .get('/api/v1/favorites')
        .set('Authorization', `Bearer ${authToken}`)
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
          user_id: testUserId,
        },
      });

      const response = await request(app)
        .get('/api/v1/favorites')
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ city: newCity })
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
        .set('Authorization', `Bearer ${authToken}`)
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
          user_id: testUserId,
        },
      });

      const response = await request(app)
        .delete('/api/v1/favorites/Paris')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).not.toContain('Paris');
      expect(response.body).toHaveProperty('message');

      // Verify it was actually removed from DB
      const dbEntry = await prisma.favorite_cities.findFirst({
        where: { city_name: 'Paris', user_id: testUserId },
      });
      expect(dbEntry).toBeNull();
    });
  });
});
