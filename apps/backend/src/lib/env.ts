import { config } from "dotenv";
import path from "node:path";
import z from "zod";

config({
	path: path.resolve(
		process.cwd(),
		// eslint-disable-next-line node/no-process-env
		process.env.NODE_ENV === "test" ? ".env.test" : ".env",
	),
});

const EnvSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]),
	PORT: z.coerce.number().default(5001),
	MONGODB_URI: z.url(),
	JWT_SECRET: z.string(),
	CLOUDINARY_CLOUD_NAME: z.string(),
	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
});
// eslint-disable-next-line node/no-process-env
const parsedData = EnvSchema.safeParse(process.env);
if (!parsedData.success) {
	console.error("❌ Invalid env:");
	console.error(parsedData.error.flatten().fieldErrors);
	process.exit(1);
}
const env = parsedData.data;
export default env;
