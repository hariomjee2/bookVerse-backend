"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateVote;
const logger_1 = __importDefault(require("../utils/logger"));
function validateVote(req, res, next) {
    const { vote } = req.body;
    if (!['up', 'down'].includes(vote)) {
        logger_1.default.warn(`Vote validation failed: Invalid vote type - ${vote}`);
        return res.status(400).json({ message: 'Vote must be "up" or "down".' });
    }
    logger_1.default.info(`Vote validation passed: ${vote}`);
    next();
}
