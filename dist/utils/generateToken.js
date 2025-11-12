"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./logger"));
function generateToken(user) {
    try {
        const token = jsonwebtoken_1.default.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger_1.default.info(`Token generated successfully for user: ${user.username}`);
        return token;
    }
    catch (err) {
        logger_1.default.error(`Failed to generate token for user ${user.username}: ${err?.message || err}`);
        throw err;
    }
}
