import bcrypt, { compare } from "bcrypt";
import { prisma } from "../prisma/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshAccessToken,
} from "./tokenService";

const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<Boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const hashedPassword = await hashPassword(password);

    return prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) return null;

    const token = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      roles: user.roles,
      last_login_at: user.last_login_at,
      is_active: user.is_active,
      token,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshAccessToken(refreshToken);

  if (!payload) return null;

  const user = await prisma.users.findUnique({ where: { id: payload.id } });

  if (!user) return null;

  return generateAccessToken(user.id, user.email);
};
