const request = require('supertest');
const app = require('../index');

describe('E2E API & Security Headers', () => {
  it('should respond to OPTIONS preflight with allowed methods and headers', async () => {
    const res = await request(app)
      .options('/api/products')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Authorization, Content-Type');

    expect([200, 204]).toContain(res.statusCode);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should reject unauthorized origin for CORS headers', async () => {
    const res = await request(app)
      .options('/api/products')
      .set('Origin', 'https://malicious-site.example')
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('should set Cache-Control no-store on API responses', async () => {
    const res = await request(app).get('/api/products');
    expect(res.headers['cache-control']).toMatch(/no-store/);
  });

  it('should include standard security headers', async () => {
    const res = await request(app).get('/api/products');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });
});
