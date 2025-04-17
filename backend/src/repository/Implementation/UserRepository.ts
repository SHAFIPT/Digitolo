
import User from "../../model/user";
import { IUser } from "../../types/auth.types";
import { AppError } from "../../utils/appError";
import { IUserRepository } from "../Interface/IUser.repository";


export class UserAuthRepository implements IUserRepository{
  
    async createUser(user: IUser): Promise<IUser | null> {
        try {
            const isExistUser = await User.findOne({ email: user.email });

            if (isExistUser) {
                throw new Error('User already exists');
            }

            const newUser = new User(user);
            const savedUser = await newUser.save();

            const createdUser = await User.findById(savedUser._id).select('-password -refreshToken');
            return createdUser;
        } catch (error) {
            console.error('Error in create user:', error);
            throw new Error('Failed to create user.');
        }
    }
    async saveUserRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>{
        try {
        
            return User.findByIdAndUpdate(userId, { refreshToken });
            
        } catch (error) {
            console.error('Error saving refresh token:', error);
            throw new Error('Failed to save refresh token.');
        }
    }
    async findByUserEmail(email: string): Promise<IUser | null> {
        try {

            const registedUser = await User.findOneAndUpdate(
                { email: email },  // Search for the user by email
                { $set: { lastLogin: new Date() } },  // Update lastLogin field
                { new: true }  // Return the updated user
            );


            if (!registedUser) {
                throw new AppError('User is not found', 404);
            }

            return registedUser
            
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw new Error('Failed to find user.');
        }
    }
    async removeRefreshToken(userId: string, refreshToken: string): Promise<IUser | null> {
        try {

            const userWithRemovedToken = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { refreshToken: refreshToken } },
                { new: true }
            ).select("-password -refreshToken");
        
            return userWithRemovedToken;
            
        } catch (error) {
            return null
        }
    }
}