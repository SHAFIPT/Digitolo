import { Router } from "express";
import { userController } from "../controller/userController";
import { container } from "tsyringe";
import { AuthenticatedRequest, decodedUserRefreshToken, verifyUserRefreshToken } from "../middleware/authentication";
const userRouter = Router()
const controllers = container.resolve(userController)

userRouter.post('/register', (req, res, next) => controllers.register(req, res, next));
userRouter.post('/sendOtp', (req, res, next) => controllers.sendOtp(req, res, next));
userRouter.post('/verifyOTP', (req, res, next) => controllers.verifyOtp(req, res, next));
userRouter.post('/resendOtp', (req, res, next) => controllers.resendOtp(req, res, next));
userRouter.post('/login', (req, res, next) => controllers.login(req, res, next));
userRouter.post(
  "/refresh-token",
  verifyUserRefreshToken,
  (req, res, next) => controllers.refreshAccessToken(req as AuthenticatedRequest, res, next)
);
userRouter.post('/logout',decodedUserRefreshToken, (req, res, next) => controllers.logout(req as AuthenticatedRequest, res, next));

export default userRouter