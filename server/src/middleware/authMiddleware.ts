import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
} from "../services/tokenService";

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).json({ message: "Np token provided" });
    return;
  }

  const [, token] = authHeader.split(" ");
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  req.user = decoded;
  next();
};
