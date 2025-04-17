import { inject, injectable } from "tsyringe";
import { Request, Response ,NextFunction ,CookieOptions} from "express";
import { STATUS_CODE } from "../enums/statusCodes";
import { MESSAGES } from "../constants/messages";
import { AuthenticatedRequest } from "../middleware/authentication";
import { IUserService } from "../service/Interface/IUser.service";
import { IOTPservices } from "../service/Interface/IOtp.Service";
@injectable()
export class userController {
    constructor(
        @inject("IUserService") private readonly userService: IUserService,
        @inject("IOtpService") private readonly otpService: IOTPservices,
    ) { }

    private readonly REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: 'none', // Critical for cross-domain requests
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    

    public async sendOtp(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> { 
        try {
        const { email } = req.body; 
        const result = await this.otpService.sendOtp(email);
        res.status(STATUS_CODE.OK).json({
                success: true,
                message: MESSAGES.OTP_SENT,
                data: result
            });
        } catch (error) {
            next(error)
        }
    }
    
    public async verifyOtp(req: Request, res: Response , next: NextFunction): Promise<void> {
        try {
            
            const { email, otp } = req.body;
            
            const isValid = await this.otpService.verifyOtp(email, otp);
                res.status(STATUS_CODE.OK).json({
                    success: isValid,
                    message: isValid ? MESSAGES.OTP_VERIFIED : MESSAGES.INVALID_OTP
                });
        } catch (error) {
            next(error)
        }
    }

    public async resendOtp(req: Request, res: Response , next: NextFunction): Promise<void> {
        try {
              const { email } = req.body;
                const result = await this.otpService.resendOtp(email);
                res.status(STATUS_CODE.OK).json({
                    success: true,
                    message: MESSAGES.OTP_RESENT,
                    data: result
                });
        } catch (error) {
            next(error)
        }
    }
    

    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { user } = req.body;

        if (!user) {
            res.status(STATUS_CODE.NOT_FOUND).json({ error: MESSAGES.USER_DETAILS_NOT_FOUND  });
            return;
        }
            const { user: registeredUser, accessToken, refreshToken } = 
                await this.userService.register(user);

        res.cookie('refreshToken', refreshToken, this.REFRESH_TOKEN_COOKIE_OPTIONS);
        
            // Send response with user data and access token
            res.status(STATUS_CODE.CREATED).json({
                success: true,
                message: MESSAGES.USER_REGISTERED,
                data: {
                    user: registeredUser,
                    accessToken    
                }
            });

      
    } catch (error) {
        next(error);
    }
}


     public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
            
             const { email, password } = req.body;

            if (!email || !password  ) {
                res.status(STATUS_CODE.BAD_REQUEST).json({ error: MESSAGES.EMAIL_PASSWORD_REQUIRED });
                return;
            }
            
            const loginResult = await this.userService.login({ email, password });
            
            if (loginResult) {
                
                res.cookie('refreshToken', loginResult.refreshToken, this.REFRESH_TOKEN_COOKIE_OPTIONS);
                
                res.status(STATUS_CODE.OK).json({
                    message: MESSAGES.LOGIN_SUCCESFUL,
                    user: loginResult.user,
                    accessToken: loginResult.accessToken
                });
            } else {
                res.status(STATUS_CODE.SERVER_ERROR).json({
                    message: MESSAGES.LOGIN_FAILD,
                });
            }  
        } catch (error) {
            next(error);
        }
    }

    public async refreshAccessToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
    ): Promise<void> {
        const { user } = req;
        
        console.log('Ths sithe user refreshdtoken user..........',user)

    try {
        const accessToken = await this.userService.refreshAccessToken(user.rawToken);

        if (accessToken) {
        res.status(STATUS_CODE.OK).json({
            message: MESSAGES.TOKEN_CREATED_SUCCESSFULLY,
            accessToken,
        });
        }
    } catch (error) {
       next(error)
    }
    }

    public async logout(
  req: AuthenticatedRequest,
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
      const { user } = req;
      
      console.log('Thnsi isth the user for logut ::',user)

    const logoutData = await this.userService.logout(user.rawToken, user.id);

    if (logoutData) {
      res.status(STATUS_CODE.OK)
        .clearCookie("refreshToken")
        .json({message : MESSAGES.USER_LOGIN_SUCCESSFULY});
    }
  } catch (error) {
    next(error);
  }
}
}