const request = require('supertest');
const app = require('../index');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'jane@atlas.co.za', password: 'pass' });

  token = res.body.jwt_token;
  //console.log('Token:', token); 
});

describe('Protected route', () => {
  it('should allow access to profile with valid token', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Protected route accessed: Profile');
  });

  it('should allow access to preferences with valid token', async () => {
    const res = await request(app)
      .get('/profile/preferences')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Protected route accessed: Profile/Preferences');
  });

  it('should allow access to dashboard with valid token', async () => {
    const res = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Protected route accessed: Dashboard');
  });

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
