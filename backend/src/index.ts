import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT!;

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);
app.route("/message", messageRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: Number(PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    connectDB();
  }
);
