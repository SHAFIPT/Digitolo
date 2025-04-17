
import { injectable, inject } from "tsyringe";
import {  IOtpData } from "../../types/auth.types";
import { IOTPservices } from "../Interface/IOtp.Service";
import { sendEmailOtp } from "../../utils/emailUtils";
import { IOtpRepository } from "../../repository/Interface/IOtpRepository";

@injectable()
export class OtpService implements IOTPservices {
    constructor(@inject("IOtpRepository")
        private otpRepository: IOtpRepository)
    { }

    async sendOtp(email: string): Promise<IOtpData | null> {
        const newOTp = await this.otpRepository.createOtp(email);

        if (!newOTp) {
            throw new Error('Error in newOTp createOtp...')
        }
        const sendOTP = await sendEmailOtp(email, newOTp.otp);
            if (!sendOTP) {
                throw new Error('Faild to send the otp to the user ')
            } 

            return newOTp

    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const existOTP  = await this.otpRepository.findByEmail(email);

        if (!existOTP) {
            throw new Error('OTP not found for the user...')
        }
        console.log('this is the OTP from DB :', existOTP.otp)
       console.log('this is the expiration time from DB :', existOTP.expirationTime)
        if (new Date() > new Date(existOTP.expirationTime)) {
            throw new Error('OTP is expired')
        }
        if (existOTP.otp !== otp) {
            throw new Error("Invalid otp ")     
        }

        await this.otpRepository.deleteOtp(email);
        return true
    }

    async resendOtp(email: string): Promise<IOtpData | null> {
        return this.otpRepository.createOtp(email);
    }

    async isOtpValid(email: string, otp: string): Promise<boolean> {
        return this.otpRepository.verifyOtp(email, otp);
    }
}