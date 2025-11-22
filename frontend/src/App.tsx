import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home-page.tsx";
import SignUpPage from "./pages/signup-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import SettingsPage from "./pages/settings-page.tsx";
import ProfilePage from "./pages/profile-page.tsx";
import Navbar from "./components/navbar.tsx";
import { useAuthStore } from "./store/use-auth-store.ts";
import { useEffect } from "react";

export default function App() {
  const { authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
