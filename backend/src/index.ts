import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoute from "./routes/auth.route.js";

const app = new Hono();

app.route("/api/auth", authRoute);

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
