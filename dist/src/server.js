"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const rateLimiter_1 = __importDefault(require("../middleware/rateLimiter"));
const logger_1 = __importDefault(require("./utils/logger"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(rateLimiter_1.default);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    logger_1.default.info(`${req.method} ${req.url}`);
    next();
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/books', bookRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.get('/', (_req, res) => {
    logger_1.default.info('Root endpoint accessed');
    res.send('BookVerse API is running');
});
const mongoUri = process.env.MONGO_URI;
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    logger_1.default.info('Connected to MongoDB');
    const port = process.env.PORT || '5000';
    app.listen(Number(port), () => {
        logger_1.default.info(`Server running on port ${port}`);
    });
})
    .catch((err) => {
    logger_1.default.error(`MongoDB connection error: ${err.message}`);
});
exports.default = app;
