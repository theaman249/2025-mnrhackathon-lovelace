const request = require('supertest');
const app = require('../index');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'janedoe@gmail.com', password: 'pass' });

  token = res.body.token;
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
});
