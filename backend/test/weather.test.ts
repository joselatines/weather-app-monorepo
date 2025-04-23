import request from 'supertest';
import app from '../src/app';

describe('GET /api/v1/weather', () => {
  it('responds with weather data for valid city', async () => {
    const response = await request(app)
      .get('/api/v1/weather')
      .query({ city: 'London' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.data).toHaveProperty('city', 'London');
    expect(response.body.data).toHaveProperty('temperature');
    expect(response.body.data).toHaveProperty('condition');
    expect(response.body).toHaveProperty('message');
  });

  it('responds with 400 when city parameter is missing', async () => {
    await request(app)
      .get('/api/v1/weather')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

describe('GET /api/v1/weather/autocomplete', () => {
  it('responds with city suggestions for valid query', async () => {
    const response = await request(app)
      .get('/api/v1/weather/autocomplete')
      .query({ query: 'lo' })
      .set('Accept', 'application/json')
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
      .expect('Content-Type', /json/)
      .expect(400);
  });
});
