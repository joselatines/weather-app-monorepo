import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/config';

const TEST_USER = {
  user_id: 'test-user-id',
  username: 'testuser'
};

const authToken = jwt.sign(TEST_USER, JWT_SECRET, { expiresIn: '1h' });

describe('GET /api/v1/weather', () => {
  it('responds with weather data for valid city', async () => {
    const response = await request(app)
      .get('/api/v1/weather')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ city: 'London' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.data.location).toHaveProperty('name', 'London');
    expect(response.body.data.location).toHaveProperty('region');
    expect(response.body.data).toHaveProperty('current');
    expect(response.body).toHaveProperty('message');
  });

  it('responds with 400 when city parameter is missing', async () => {
    await request(app)
      .get('/api/v1/weather')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('responds with 400 when city parameter is not valid', async () => {
    const response = await request(app)
      .get('/api/v1/weather?city=InvalidCity')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    expect(response.body.message).toContain('No matching location found.');
    expect(response.body.data).not.toHaveProperty('current');
  });

});

describe('GET /api/v1/weather/autocomplete', () => {
  it('responds with city suggestions for valid query', async () => {
    const response = await request(app)
      .get('/api/v1/weather/autocomplete')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ query: 'vene' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body).toHaveProperty('message');
  });

  it('responds with 400 when query parameter is missing', async () => {
    await request(app)
      .get('/api/v1/weather/autocomplete')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(400);
  });

  it('responds with 200 when invalid query', async () => {
    const response = await request(app)
      .get('/api/v1/weather/autocomplete')
      .query({ query: 'invalidquery' })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(0);
  });
});
