import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../types/auth.types';



const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    isBlocked: { type: Boolean, default: false },
    refreshToken: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>('Users', UserSchema)

export default User;
