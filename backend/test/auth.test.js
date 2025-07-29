const request = require('supertest');
const app = require('../index'); // or wherever your Express app is

describe('Auth endpoints', () => {
  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'jane@atlas.co.za', password: 'pass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('jwt_token');
  });

  it('should fail with wrong email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'janedo@gmail.com', password: 'pass' });

    expect(res.statusCode).toBe(401);
  });

  it('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'jane@atlas.co.za', password: 'password1' });

    expect(res.statusCode).toBe(401);
  });

  it('should logout successfully', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .send();
    expect(res.statusCode).toBe(200);
  });
});
