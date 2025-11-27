import { create } from "zustand";
import { THEMES } from "../constants";

type Theme = (typeof THEMES)[number];

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const localStorageKey = "chat-theme";

const initialTheme = document.documentElement.getAttribute("data-theme") as Theme;

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem(localStorageKey, theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
