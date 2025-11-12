import { Document, Schema, model, Types } from 'mongoose';

export interface IReview extends Document {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 }
}, { timestamps: true });

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export default model<IReview>('Review', reviewSchema);
