"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
let token = '';
let bookId = '';
let reviewId = '';
describe('Review Routes', () => {
    beforeAll(async () => {
        // Sign up and log in
        const signupRes = await (0, supertest_1.default)(server_1.default)
            .post('/api/auth/signup')
            .send({
            username: 'reviewer1',
            email: 'reviewer1@example.com',
            password: 'ReviewPass#123'
        });
        const loginRes = await (0, supertest_1.default)(server_1.default)
            .post('/api/auth/login')
            .send({
            email: 'reviewer1@example.com',
            password: 'ReviewPass#123'
        });
        token = loginRes.body.token;
        expect(token).toBeDefined();
        // Create a book to review
        const bookRes = await (0, supertest_1.default)(server_1.default)
            .post('/api/books')
            .set('Authorization', `Bearer ${token}`)
            .send({
            title: 'Clean Code',
            author: 'Robert C. Martin',
            genre: 'Programming',
            year: 2008
        });
        bookId = bookRes.body.book._id;
        expect(bookId).toBeDefined();
    });
    it('should add a review for a book', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
            bookId,
            rating: 5,
            comment: 'A must-read for developers!'
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.review).toBeDefined();
        reviewId = res.body.review._id;
    });
    it('should prevent duplicate review by same user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
            bookId,
            rating: 4,
            comment: 'Trying to review again'
        });
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toMatch(/already reviewed/);
    });
    it('should fail to review a nonexistent book', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${token}`)
            .send({
            bookId: '000000000000000000000000',
            rating: 3,
            comment: 'Invalid book'
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/Book not found/);
    });
});
