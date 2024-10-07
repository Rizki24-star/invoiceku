import { Users } from "@prisma/client";
import { getJwtConfig } from "../config/jwt";
import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: number, email: string): string => {
  const { TOKEN_SECRET_KEY, TOKEN_EXPIRES_IN } = getJwtConfig();
  return jwt.sign({ id: userId, email }, TOKEN_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId: number): string => {
  const { REFRESH_TOKEN_SECRET_KEY, REFRESH_TOKEN_EXPIRES_IN } = getJwtConfig();
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (
  token: string
): { id: number; email: string } | null => {
  try {
    const { TOKEN_SECRET_KEY } = getJwtConfig();
    return jwt.verify(token, TOKEN_SECRET_KEY) as { id: number; email: string };
  } catch (error) {
    return null;
  }
};

export const verifyRefreshAccessToken = (
  token: string
): { id: number; email: string } | null => {
  try {
    const { REFRESH_TOKEN_SECRET_KEY } = getJwtConfig();
    return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY) as {
      id: number;
      email: string;
    };
  } catch (error) {
    return null;
  }
};
