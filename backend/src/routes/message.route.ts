import { Hono } from "hono";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

const messageRoutes = new Hono();

messageRoutes.get("/users", protectRoute, async (c) => {
  try {
    const filteredUsers = await User.find({ _id: { $ne: c.var.user.userID } }).select("-password");

    return c.json(
      filteredUsers.map((u) => ({
        _id: u._id.toHexString(),
        fullName: u.fullName,
        email: u.email,
        profilePic: u.profilePic,
      }))
    );
  } catch (error) {
    console.log("Error in getUsers route", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

messageRoutes.get("/:id", protectRoute, async (c) => {
  try {
    const userToChatId = c.req.param("id");
    const myId = c.get("user").userID;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    return c.json(messages, 200);
  } catch (error) {
    console.log("Error in getMessages route", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

const sendMessageSchema = z.object({
  text: z.string(),
  image: z.base64url().nullable(),
});

messageRoutes.post("/send/:id", protectRoute, zValidator("json", sendMessageSchema), async (c) => {
  try {
    const { image, text } = c.req.valid("json");
    const receiverId = c.req.param("id");
    const senderId = c.var.user.userID;

    // todo: check if receiverId exists

    let imageUrl;
    if (image) {
      const uploadedRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadedRes.secure_url;
    }

    const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });

    await newMessage.save();

    // todo: realtime functionality goes here with socket.io

    return c.json(newMessage, 201);
  } catch (error) {
    console.log("Error in sendMessage route", error);
    return c.json({ message: "Internal server error" }, 500);
  }
});

export default messageRoutes;
