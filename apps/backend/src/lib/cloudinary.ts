import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import env from "./env.js";

config();

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
