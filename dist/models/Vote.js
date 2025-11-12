"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const voteSchema = new mongoose_1.Schema({
    reviewId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    vote: { type: String, enum: ['up', 'down'], required: true }
});
voteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('Vote', voteSchema);
