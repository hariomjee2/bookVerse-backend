"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const logger_1 = __importDefault(require("../utils/logger"));
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        logger_1.default.info(`Signup attempt for username: ${username}, email: ${email}`);
        const existingUser = await User_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            logger_1.default.warn(`Signup failed: Username or email already exists - ${username}`);
            return res.status(409).json({ message: 'Username or email already exists.' });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({ username, email, passwordHash });
        await user.save();
        logger_1.default.info(`User successfully created: ${username}`);
        const token = (0, generateToken_1.default)(user);
        return res.status(201).json({ token });
    }
    catch (err) {
        logger_1.default.error(`Signup error: ${err?.message || err}`);
        return res.status(500).json({ message: 'Signup failed.', error: err?.message || String(err) });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger_1.default.info(`Login attempt for email: ${email}`);
        const user = await User_1.default.findOne({ email });
        if (!user) {
            logger_1.default.warn(`Login failed: User not found - ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            logger_1.default.warn(`Login failed: Invalid password for user - ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        logger_1.default.info(`User successfully logged in: ${email}`);
        const token = (0, generateToken_1.default)(user);
        return res.json({ token });
    }
    catch (err) {
        logger_1.default.error(`Login error: ${err?.message || err}`);
        return res.status(500).json({ message: 'Login failed.', error: err?.message || String(err) });
    }
};
exports.login = login;
exports.default = { signup: exports.signup, login: exports.login };
