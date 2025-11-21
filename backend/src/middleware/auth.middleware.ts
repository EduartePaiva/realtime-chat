import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verifyAndExtractJwtUserID } from "../lib/utils.js";
import User from "../models/user.model.js";

type UserMiddlewareData = {
  userID: string;
  email: string;
  fullName: string;
  profilePic: string;
};

export const protectRoute = createMiddleware<{
  Variables: {
    user: UserMiddlewareData;
  };
}>(async (c, next) => {
  const jwtToken = getCookie(c, "token");
  if (!jwtToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const userId = verifyAndExtractJwtUserID(jwtToken, process.env.JWT_SECRET!);

    const user = await User.findById(userId).select("-password").exec();
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    c.set("user", {
      userID: userId,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("error verifying token", err);
    return c.json({ message: "Unauthorized" }, 401);
  }

  await next();
});
