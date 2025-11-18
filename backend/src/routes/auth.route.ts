import { Hono } from "hono";

const authRoutes = new Hono();

authRoutes.post("/signup", (c) => {
  return c.text("signup route");
});
authRoutes.post("/login", (c) => {
  return c.text("login route");
});
authRoutes.post("/logout", (c) => {
  return c.text("logout route");
});

export default authRoutes;
