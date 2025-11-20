import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";

export const generateJwtToken = (userId: string, jwtSecret: string) => {
  const token = jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });

  return token;
};

/**
 * @throws error if token is invalid
 */
export const verifyAndExtractJwtUserID = (token: string, jwtSecret: string) => {
  const payload = jwt.verify(token, jwtSecret);

  const userID = payload["sub"] as string;

  return userID;
};

export const saveJwtCookie = (c: Context, value: string) => {
  setCookie(c, COOKIE_NAME, value, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export const deleteJwtCookie = (c: Context) => {
  return deleteCookie(c, COOKIE_NAME);
};
