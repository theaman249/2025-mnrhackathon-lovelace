const request = require('supertest');
const app = require('../index');

describe('Protected route', () => {
  it('should deny access to profile without token', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
  });

  it('should deny access to preferences without token', async () => {
    const res = await request(app).get('/profile/preferences');
    expect(res.statusCode).toBe(401);
  });

  it('should deny access to dashboard without token', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.statusCode).toBe(401);
  });
});
