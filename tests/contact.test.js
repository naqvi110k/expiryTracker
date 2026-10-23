const request = require('supertest');
const app = require('../index');

describe('Contact Form API', () => {
  it('should return 400 when fields are missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Alice' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('All fields are required');
  });

  it('should return 400 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Alice',
        email: 'invalid-email',
        subject: 'General Inquiry',
        message: 'This is a test message longer than 10 chars.'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Please provide a valid email address');
  });

  it('should return 400 when message is under 10 characters', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        subject: 'Hi',
        message: 'Short'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Message must be at least 10 characters long');
  });
});
