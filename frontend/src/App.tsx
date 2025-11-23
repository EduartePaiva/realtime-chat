import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/home-page.tsx";
import SignUpPage from "./pages/signup-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import SettingsPage from "./pages/settings-page.tsx";
import ProfilePage from "./pages/profile-page.tsx";
import Navbar from "./components/navbar.tsx";
import { useAuthStore } from "./store/use-auth-store.ts";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}
