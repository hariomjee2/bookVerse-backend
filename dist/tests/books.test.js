"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
let token = '';
let createdBookId = '';
describe('Books Routes', () => {
    beforeAll(async () => {
        // Sign up and log in to get a token
        const signupRes = await (0, supertest_1.default)(server_1.default)
            .post('/api/auth/signup')
            .send({
            username: 'bookpassword',
            email: 'bookpassword@example.com',
            password: 'SecurePass#123'
        });
        const loginRes = await (0, supertest_1.default)(server_1.default)
            .post('/api/auth/login')
            .send({
            email: 'bookpassword@example.com',
            password: 'SecurePass#123'
        });
        token = loginRes.body.token;
        expect(token).toBeDefined();
    });
    it('should fail to create a book with invalid genre', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
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
        const res = await (0, supertest_1.default)(server_1.default)
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
        const res = await (0, supertest_1.default)(server_1.default).get('/api/books?page=1&limit=5&genre=Programming');
        expect(res.statusCode).toBe(200);
        expect(res.body.books).toBeInstanceOf(Array);
    });
    it('should fetch book details with reviews and stats', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get(`/api/books/${createdBookId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.book).toBeDefined();
        expect(res.body.stats).toHaveProperty('averageRating');
    });
    it('should fail to fetch non-existent book', async () => {
        const res = await (0, supertest_1.default)(server_1.default).get('/api/books/000000000000000000000000');
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toMatch(/not found/i);
    });
});
