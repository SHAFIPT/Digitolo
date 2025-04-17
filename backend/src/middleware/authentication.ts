import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenService } from "../service/Implementation/token.service";

export interface AuthenticatedRequest extends Request {
  user: {
    rawToken: string;
    id: string;
    [key: string]: any; // For any additional properties
  };
}
// Instantiate TokenService
const tokenService = new TokenService();


export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = tokenService.verifyAccessToken(token); // Make sure this returns an object with an `id` property

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      rawToken: token,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export const verifyUserRefreshToken = (
  req: Request, // Keep Express default type
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies?.refreshToken || req.header("refreshToken");
         
  if (!refreshToken) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }
  
  try {
    const decoded = tokenService.verifyRefreshToken(refreshToken);

    // ✅ Type assertion
    (req as AuthenticatedRequest).user = { rawToken: refreshToken, id: decoded.id };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token or Expired" });
    return;
  }
};
export const decodedUserRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies?.refreshToken || req.header("refreshToken");

  if (!refreshToken) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
    
    // Cast req to AuthenticatedRequest
    (req as AuthenticatedRequest).user = { 
      ...decoded, 
      rawToken: refreshToken,
      id: decoded.id // Make sure the decoded token has an id property
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token or Expired" });
    return;
  }
};