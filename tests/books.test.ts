import request from 'supertest';
import app from '../server';

let token = '';
let createdBookId = '';

describe('Books Routes', () => {
  beforeAll(async () => {
    // Sign up and log in to get a token
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'bookpassword',
        email: 'bookpassword@example.com',
        password: 'SecurePass#123'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'bookpassword@example.com',
        password: 'SecurePass#123'
      });

    token = loginRes.body.token;
    expect(token).toBeDefined();
  });

  it('should fail to create a book with invalid genre', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Invalid Genre Book',
        author: 'Author X',
        genre: 'Romance',
        year: 2020
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should create a book with valid input', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        genre: 'Programming',
        year: 1999,
        summary: 'A guide to software craftsmanship.'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.book).toBeDefined();
    createdBookId = res.body.book._id;
  });

  it('should list books with pagination and filters', async () => {
    const res = await request(app).get('/api/books?page=1&limit=5&genre=Programming');
    expect(res.statusCode).toBe(200);
    expect(res.body.books).toBeInstanceOf(Array);
  });

  it('should fetch book details with reviews and stats', async () => {
    const res = await request(app).get(`/api/books/${createdBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.book).toBeDefined();
    expect(res.body.stats).toHaveProperty('averageRating');
  });

  it('should fail to fetch non-existent book', async () => {
    const res = await request(app).get('/api/books/000000000000000000000000');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});
