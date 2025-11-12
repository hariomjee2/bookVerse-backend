"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
describe('Auth Routes', () => {
    const baseUrl = '/api/auth';
    let authToken = '';
    it('should fail signup with invalid input', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
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
        const res = await (0, supertest_1.default)(server_1.default)
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
        const res = await (0, supertest_1.default)(server_1.default)
            .post(`${baseUrl}/login`)
            .send({
            email: 'testuser123@example.com',
            password: 'WrongPassword123!'
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/Invalid credentials/);
    });
    it('should login successfully with correct credentials', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post(`${baseUrl}/login`)
            .send({
            email: 'testuser123@example.com',
            password: 'TestPass#123'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
    it('should fail signup with duplicate email', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
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
