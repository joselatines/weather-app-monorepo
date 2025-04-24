import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/services';

describe('Auth API', () => {
  const TEST_USER = {
    username: `testuser-${Date.now()}`,
    password: 'testpassword123'
  };

  afterAll(async () => {
    // Clean up test user
    await prisma.users.deleteMany({
      where: { username: TEST_USER.username }
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('registers a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(TEST_USER)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('username', TEST_USER.username);
      expect(response.body.data).toHaveProperty('user_id');
    });

    it('rejects duplicate usernames', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send(TEST_USER)
        .expect('Content-Type', /json/)
        .expect(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('logs in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(TEST_USER)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('username', TEST_USER.username);
    });

    it('rejects invalid credentials', async () => {
      await request(app)
        .post('/api/v1/auth/login')
        .send({ 
          username: TEST_USER.username,
          password: 'wrongpassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let authToken: string;

    beforeAll(async () => {
      // Login to get token
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(TEST_USER);
      authToken = response.body.data.token;
    });

    it('returns current user with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.message).toBe('Current user data fetched');
      expect(response.body.data).toHaveProperty('username', TEST_USER.username);
    });

    it('rejects request without token', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .expect('Content-Type', /json/)
        .expect(401);
    });
  });
});
