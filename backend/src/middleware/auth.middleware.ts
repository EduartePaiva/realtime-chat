import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verifyAndExtractJwtUserID } from "../lib/utils.js";

export const protectRoute = createMiddleware<{
  Variables: {
    userID: string;
  };
}>(async (c, next) => {
  const jwtToken = getCookie(c, "token");
  if (!jwtToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const userId = verifyAndExtractJwtUserID(jwtToken, process.env.JWT_SECRET!);

    c.set("userID", userId);
  } catch (err) {
    console.log("error verifying token", err);
    return c.json({ message: "Unauthorized" }, 401);
  }

  await next();
});
