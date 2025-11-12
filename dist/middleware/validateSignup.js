"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateSignup;
const logger_1 = __importDefault(require("../utils/logger"));
function validateSignup(req, res, next) {
    const { username, email, password } = req.body;
    const errors = [];
    if (!username || username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username)) {
        errors.push('Username must be at least 3 characters and alphanumeric only.');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        errors.push('Email must be valid.');
    }
    if (!password ||
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must be at least 8 characters and include uppercase, number, and symbol.');
    }
    if (errors.length > 0) {
        logger_1.default.warn(`Signup validation failed for ${email}: ${errors.join(', ')}`);
        return res.status(400).json({ errors });
    }
    logger_1.default.info(`Signup validation passed for email: ${email}`);
    next();
}
