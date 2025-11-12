"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, minlength: 3, match: /^[a-zA-Z0-9]+$/, unique: true },
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/, unique: true },
    passwordHash: { type: String, required: true }
});
exports.default = (0, mongoose_1.model)('User', userSchema);
