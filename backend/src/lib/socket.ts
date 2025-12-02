import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import dotenv from "dotenv";

dotenv.config();

const app = new Hono();

const PORT = process.env.PORT!;

const io = new Server({
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export { app, httpServer, io };
