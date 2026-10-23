const request = require('supertest');
const app = require('../index');

describe('Auth Endpoints Validation & Security', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when phone number does not start with +', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
          phoneNumber: '1234567890'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/phoneNumber must start with \+/);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 when identifier or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'testuser' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return 400 when identifier is missing', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
