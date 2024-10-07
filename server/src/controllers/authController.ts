import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { json } from "stream/consumers";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    const user = await registerUser(name, email, password);
    res.status(200).json({ message: "success", user });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    if (!user) res.status(401).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "success", user });
  } catch (error) {
    res.status(500).json({ message: "Login Failed", error });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;
  try {
    const newAccessToken = await refreshToken(refreshToken);
    if (!newAccessToken)
      res.status(401).json({ message: "Invalid refresh token" });
    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
