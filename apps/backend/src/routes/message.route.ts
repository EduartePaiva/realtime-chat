import { Hono } from "hono";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import io, { getReceiverSocketId } from "../lib/socket.js";
import type { UploadApiResponse } from "cloudinary";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
			})),
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

const sendMessageDataSchema = z
	.object({
		text: z.string().nullable().optional(),
		image: z
			.file()
			.min(1)
			.max(MAX_SIZE)
			.refine((file) => ALLOWED_MIME_TYPES.includes(file.type), { message: "Invalid image type" })
			.nullable()
			.optional(),
	})
	.refine((data) => data.text || data.image, { message: "You must send either text or an image" });
const sendMessageParamsSchema = z.object({
	id: z.string().min(1),
});

messageRoutes.post(
	"/send/:id",
	protectRoute,
	zValidator("form", sendMessageDataSchema),
	zValidator("param", sendMessageParamsSchema),
	async (c) => {
		try {
			const { image, text } = c.req.valid("form");
			const receiverId = c.req.valid("param").id;
			const senderId = c.var.user.userID;

			let imageUrl;
			if (image) {
				const imageBytes = await image.bytes();

				const result = await new Promise<UploadApiResponse>((resolve, reject) => {
					cloudinary.uploader
						.upload_stream((error, uploadResult) => {
							if (error) {
								return reject(error);
							}
							return resolve(uploadResult!);
						})
						.end(imageBytes);
				});
				imageUrl = result.secure_url;
			}

			const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });

			await newMessage.save();

			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("newMessage", newMessage);
			}

			return c.json(newMessage, 201);
		} catch (error) {
			console.log("Error in sendMessage route", error);
			return c.json({ message: "Internal server error" }, 500);
		}
	},
);

export default messageRoutes;
