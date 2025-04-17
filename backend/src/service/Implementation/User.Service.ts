import { inject, injectable } from "tsyringe";
import { IUserService } from "../Interface/IUser.service";
import bcrypt from 'bcrypt'
import { IUser } from "../../types/auth.types";
import { ITokenService } from "../Interface/Itoken.service";
import User from "../../model/user";
import { IUserRepository } from "../../repository/Interface/IUser.repository";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject("IUserRepository") private readonly userRepository: IUserRepository,
        @inject("ITokenService") private readonly tokenService: ITokenService
    ) { }

 
    async register(userData: Partial<IUser>): Promise<{ 
        user: IUser; 
        accessToken: string; 
        refreshToken: string 
    }> {
        // Validate user data
        if (!userData.email || !userData.password) {
            throw new Error('Email and password are required');
        }

        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            const newUser = new User({
                ...userData, 
                password: hashedPassword,
            })

            const user = await this.userRepository.createUser(newUser)

            if (!user) {
                throw new Error('Failed to create user');
            }

            // Generate tokens
            const tokenPayload = {
                id: user.id,
                role: user.role
            };

            const accessToken = this.tokenService.generateAccessToken(tokenPayload);
            const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

            // Save refresh token
            await this.userRepository.saveUserRefreshToken(user.id, refreshToken);

            // Return user without sensitive data
            const { password, refreshToken: _, ...userWithoutSensitive } = user;

            return {
                user: userWithoutSensitive as IUser,
                accessToken,
                refreshToken
            };

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Registration failed: ${error.message}`);
            }
            throw new Error('Registration failed');
        }
    }

    async login(credentials: { email: string; password: string }): Promise<{
        user: Omit<IUser, "password">;
        accessToken: string;
        refreshToken: string;
    }>{
        try {

            const { email, password } = credentials;
          
            let user = await this.userRepository.findByUserEmail(email);

            if (!user) {
                throw new Error('Invalid email or password.');
            }    
            
            if (!user.password) {
                throw new Error('User password not set.');
            }

            // Compare password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password.');
            }

            // Generate tokens
            const tokenPayload = {
                id: user.id,
                role: user.role 
            };
                
            const accessToken = this.tokenService.generateAccessToken(tokenPayload);
            const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

            // Save refresh token
           
            await this.userRepository.saveUserRefreshToken(user.id, refreshToken);

            // Remove sensitive data
             const { password: _, refreshToken: __, ...userWithoutSensitive } = user.toObject();

            return {
                user: userWithoutSensitive as IUser,
                accessToken,
                refreshToken
            };
            
        } catch (error) {
            console.error('Error logging in:', error);
            throw new Error(`Login failed: ${(error as Error).message}`);
        }
    }
    
   
    async refreshAccessToken(refreshToken: string): Promise<string | null> {
        try {
            const payload = await this.tokenService.verifyRefreshToken(refreshToken)

            const tokenPayload = {
                id: payload.id,
                role: payload.role
            };

            const accessToken = this.tokenService.generateAccessToken(tokenPayload);

            return accessToken
        } catch (error) {
            return null;
        }
    }
    async logout(token: string, id: string): Promise<IUser | null> {
        try {
            const user = await this.userRepository.removeRefreshToken(id,token)
    
             return user ? user : null
        } catch (error) {
          return null  
        }
    }
}