import { Outlet } from "react-router";

export default function Navbar() {
  return (
    <div>
      <p>Navbar</p>
      <Outlet />
    </div>
  );
}
