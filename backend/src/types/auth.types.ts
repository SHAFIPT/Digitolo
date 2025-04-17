import mongoose, { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  role: string;
  isBlocked: boolean;
  refreshToken: string[];
  createdAt?: Date;
  updatedAt?: Date;
}          
export interface ITokenPayload {
    id: string;
    role: string;
    // Add any other properties you want to include in the token
}

export interface IUserCredentials {
  email: string;
  password: string;
  role: string | null;
}

export interface IRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface IOtpData extends Document {
    email: string;
    otp: string;       
    expirationTime: Date;
    attempts: number;
    reSendCount: number;
    lastResendTime: Date | null;   
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
}
