"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, minlength: 3 },
    author: { type: String, required: true },
    genre: { type: String, required: true, enum: ['Programming', 'Fiction', 'Science', 'History'] },
    year: { type: Number, required: true, min: 1800, max: new Date().getFullYear() },
    summary: { type: String, maxlength: 500 },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
});
exports.default = (0, mongoose_1.model)('Book', bookSchema);
