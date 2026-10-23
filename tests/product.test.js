const request = require('supertest');
const app = require('../index');

describe('Product API Protection', () => {
  it('should return 401 when fetching products without token', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 when creating a product without token', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Milk', expiryDate: '2026-12-31' });

    expect(res.statusCode).toBe(401);
  });

  it('should return 401 when calling AI extract without token', async () => {
    const res = await request(app)
      .post('/api/products/extract')
      .send({ image: 'data:image/jpeg;base64,...' });

    expect(res.statusCode).toBe(401);
  });
});
