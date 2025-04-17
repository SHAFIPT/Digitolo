import { IOtpData } from "../../types/auth.types";


export interface IOTPservices {
    sendOtp(email: string): Promise<IOtpData | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resendOtp(email: string): Promise<IOtpData | null>;
    isOtpValid(email: string, otp: string): Promise<boolean>;
}