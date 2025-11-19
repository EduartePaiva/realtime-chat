import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

export const generateJwtToken = (userId: string, jwtSecret: string) => {
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });

  return token;
};

export const saveJwtCookie = (c: Context, value: string) => {
  setCookie(c, "token", value, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};
