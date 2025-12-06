import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import { cors } from "hono/cors";
import { Server } from "socket.io";

dotenv.config();

const app = new Hono();

const PORT = process.env.PORT!;

app.basePath("/api");

app.use(
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests", "Content-Type"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.route("/auth", authRoutes);
app.route("/messages", messageRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const httpServer = serve(
  {
    fetch: app.fetch,
    port: Number(PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    connectDB();
  }
);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
  /* options */
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});
