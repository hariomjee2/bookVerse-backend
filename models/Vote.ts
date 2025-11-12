import { Document, Schema, model, Types } from 'mongoose';

export interface IVote extends Document {
  reviewId: Types.ObjectId;
  userId: Types.ObjectId;
  vote: 'up' | 'down';
}

const voteSchema = new Schema<IVote>({
  reviewId: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vote: { type: String, enum: ['up', 'down'], required: true }
});

voteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export default model<IVote>('Vote', voteSchema);
