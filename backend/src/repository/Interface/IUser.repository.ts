import { IUser } from "../../types/auth.types";

export interface IUserRepository {
    createUser(user: IUser): Promise<IUser | null>
    saveUserRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>
    findByUserEmail(email: string): Promise<IUser | null>;
    removeRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>;
}