"use client";

import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo, useState, useEffect, createContext, useContext } from "react";
import { getTheme } from "./Theme";

type ThemeContextType = {
  mode: "light" | "dark";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeMode must be used within ThemeRegistry");
  return context;
};

type ThemeRegistryProps = {
  children: React.ReactNode;
  initialMode: "light" | "dark";
};

export default function ThemeRegistry({ children, initialMode }: ThemeRegistryProps) {
  const [mode, setMode] = useState<"light" | "dark">(initialMode);

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.cookie = `theme=${mode}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
