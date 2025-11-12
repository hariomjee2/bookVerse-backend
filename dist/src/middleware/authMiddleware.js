"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../utils/logger"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger_1.default.warn(`Auth failed: Missing or invalid token from ${req.ip}`);
        return res.status(401).json({ message: 'Missing or invalid token.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        logger_1.default.info(`Authentication successful for user: ${decoded.username}`);
        req.user = decoded;
        next();
    }
    catch (err) {
        logger_1.default.error(`Token verification failed: ${err?.message || err} from ${req.ip}`);
        return res.status(401).json({ message: 'Unauthorized.' });
    }
}
