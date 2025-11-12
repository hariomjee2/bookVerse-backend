import request from 'supertest';
import app from '../server';

describe('Auth Routes', () => {
  const baseUrl = '/api/auth';
  let authToken = '';

  it('should fail signup with invalid input', async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send({
        username: 'ab',
        email: 'invalidemail',
        password: '123'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should signup successfully with valid input', async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send({
        username: 'testuser123',
        email: 'testuser123@example.com',
        password: 'TestPass#123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({
        email: 'testuser123@example.com',
        password: 'WrongPassword123!'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid credentials/);
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({
        email: 'testuser123@example.com',
        password: 'TestPass#123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail signup with duplicate email', async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send({
        username: 'anotheruser',
        email: 'testuser123@example.com',
        password: 'AnotherPass#123'
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already exists/);
  });
});
