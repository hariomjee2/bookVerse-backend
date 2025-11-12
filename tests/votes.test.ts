import request from 'supertest';
import app from '../server';

let token = '';
let reviewId = '';

describe('Vote Routes', () => {
  beforeAll(async () => {
    // Sign up and log in
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'voter1',
        email: 'voter1@example.com',
        password: 'VotePass#123'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'voter1@example.com',
        password: 'VotePass#123'
      });

    token = loginRes.body.token;
    expect(token).toBeDefined();

    // Create a book and review to vote on
    const bookRes = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Refactoring',
        author: 'Martin Fowler',
        genre: 'Programming',
        year: 1999
      });

    const bookId = bookRes.body.book._id;
    expect(bookId).toBeDefined();

    const reviewRes = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bookId,
        rating: 4,
        comment: 'Great insights into code structure!'
      });

    reviewId = reviewRes.body.review._id;
    expect(reviewId).toBeDefined();
  });

  it('should upvote a review', async () => {
    const res = await request(app)
      .patch(`/api/reviews/${reviewId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'up' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Vote recorded/);
  });

  it('should prevent duplicate vote on the same review', async () => {
    const res = await request(app)
      .patch(`/api/reviews/${reviewId}/vote`)
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'down' });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already voted/);
  });

  it('should fail to vote on nonexistent review', async () => {
    const res = await request(app)
      .patch('/api/reviews/000000000000000000000000/vote')
      .set('Authorization', `Bearer ${token}`)
      .send({ vote: 'up' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Review not found/);
  });
});
