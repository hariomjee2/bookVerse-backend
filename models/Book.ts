import { Document, Schema, model, Types } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: 'Programming' | 'Fiction' | 'Science' | 'History';
  year: number;
  summary?: string;
  createdBy: Types.ObjectId;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true, minlength: 3 },
  author: { type: String, required: true },
  genre: { type: String, required: true, enum: ['Programming', 'Fiction', 'Science', 'History'] },
  year: { type: Number, required: true, min: 1800, max: new Date().getFullYear() },
  summary: { type: String, maxlength: 500 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export default model<IBook>('Book', bookSchema);
