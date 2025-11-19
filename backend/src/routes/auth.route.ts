import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJwtToken, saveJwtCookie } from "../lib/utils.js";

const authRoutes = new Hono();

const JWT_SECRET = process.env.JWT_SECRET!;

const signupSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

authRoutes.post("/signup", zValidator("json", signupSchema), async (c) => {
  const { email, fullName, password } = c.req.valid("json");

  try {
    const res = await User.findOne({ email: email });

    if (res) return c.json({ message: "Email already exists" }, 400);

    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({ password: hashedPass, fullName, email });
    await newUser.save();

    const jwtToken = generateJwtToken(newUser._id.toHexString(), JWT_SECRET);
    saveJwtCookie(c, jwtToken);

    return c.json(
      {
        _id: newUser._id.toHexString(),
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
      201
    );
  } catch (err) {
    console.log("error in signup", err);

    return c.json({ message: "internal server error" }, 500);
  }
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  try {
    const user = await User.findOne({ email: email }).exec();
    if (user === null) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      return c.json({ message: "Invalid email or password" }, 401);
    }

    const jwtToken = generateJwtToken(user.id, JWT_SECRET);

    return c.json({ token: jwtToken }, 201);
  } catch (error) {
    console.error(error);

    return c.json({ message: "Internal server error" }, 500);
  }
});
authRoutes.post("/logout", (c) => {
  return c.text("logout route");
});

export default authRoutes;
