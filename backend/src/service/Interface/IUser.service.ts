import { IUser } from "../../types/auth.types";

export interface IUserService {
    register(user: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }>
    login(credentials: { email: string; password: string }): Promise<{
        user: Omit<IUser, "password">;
        accessToken: string;
        refreshToken: string;
    }>
    refreshAccessToken(refreshToken: string): Promise<string | null>;
    logout(token: string, id: string): Promise<IUser | null>
}