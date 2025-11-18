import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth.route.js";

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 5001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
