import dotenv from "dotenv";

dotenv.config();

export const getJwtConfig = () => ({
  TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY || "token_secret_key",
  REFRESH_TOKEN_SECRET_KEY:
    process.env.REFRESH_TOKEN_SECRET_KEY || "refresh_token_secret_key",
  TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",
});
