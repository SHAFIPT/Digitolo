
import { IUserCredentials, IOtpData } from "../../types/auth.types";
import { IOtpRepository } from "../Interface/IOtpRepository";
import { generateExpirationTime , generateOtp } from "../../utils/otpUtils";
import { BaseRepository } from "../BaseRepositories/BaseRepository";
import otpModel from '../../model/OTPModal'

export class OtpRepository extends BaseRepository <IOtpData> implements IOtpRepository{

    constructor() {
        super(otpModel)
    }

    async createOtp(email: string): Promise<IOtpData | null> {
        const otp = generateOtp()
        console.log('Thsis ie the otp :::',otp)
        const expirationTime = generateExpirationTime(1);
        console.log('This is the expiratiosn date time ',expirationTime)

         const newOtp = new otpModel({
            email,
            otp,
            expirationTime,
            attempts: 0,
            reSendCount: 0,
            lastResendTime: null
         });

        await newOtp.save()
        return newOtp;

    }

    async findByEmail(email: string): Promise<IOtpData | null> {
        return await this.model.findOne({ email }).sort({ createdAt: -1 }).exec();
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await this.findOne({ email, otp });
        return otpRecord !== null;
    }

    async deleteOtp(email: string): Promise<boolean> {
        const result = await otpModel.deleteOne({ email });
        return result.deletedCount > 0;
    }

     async updateOtp(email: string, otp: string): Promise<IOtpData | null> {
        return await otpModel.findOneAndUpdate(
            { email },
            { otp, expirationTime: generateExpirationTime(1) },
            { new: true }
        );
    }
}