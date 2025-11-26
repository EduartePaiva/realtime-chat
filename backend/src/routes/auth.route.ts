import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { deleteJwtCookie, generateJwtToken, saveJwtCookie } from "../lib/utils.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const authRoutes = new Hono();

const signupSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

authRoutes.post("/signup", zValidator("json", signupSchema), async (c) => {
  const { email, fullName, password } = c.req.valid("json");
  const JWT_SECRET = process.env.JWT_SECRET!;

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
        createdAt: newUser.createdAt,
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
  const JWT_SECRET = process.env.JWT_SECRET!;

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
    saveJwtCookie(c, jwtToken);

    return c.json(
      {
        _id: user._id.toHexString(),
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
      201
    );
  } catch (error) {
    console.error(error);

    return c.json({ message: "Internal server error" }, 500);
  }
});

authRoutes.post("/logout", (c) => {
  try {
    deleteJwtCookie(c);
    return c.json({ message: "Logged out successfully" }, 200);
  } catch (error) {
    console.error("Error in logout", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

const updateProfileSchema = z.object({
  profilePic: z.string(),
});

authRoutes.put(
  "/update-profile",
  protectRoute,
  zValidator("json", updateProfileSchema),
  async (c) => {
    const { userID } = c.var.user;
    const { profilePic } = c.req.valid("json");

    try {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, { image_metadata: true });

      const updatedUser = await User.findByIdAndUpdate(
        userID,
        {
          profilePic: uploadResponse.secure_url,
        },
        { new: true }
      ).exec();

      c.json(updatedUser, 200);
    } catch (error) {
      console.log("error in update profile: ", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  }
);

authRoutes.get("/check", protectRoute, (c) => {
  return c.json({ ...c.get("user") }, 200);
});

export default authRoutes;
