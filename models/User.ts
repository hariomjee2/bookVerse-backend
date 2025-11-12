import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, minlength: 3, match: /^[a-zA-Z0-9]+$/, unique: true },
  email: { type: String, required: true, match: /^\S+@\S+\.\S+$/, unique: true },
  passwordHash: { type: String, required: true }
});

export default model<IUser>('User', userSchema);
