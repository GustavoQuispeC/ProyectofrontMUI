import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    colorSchemes: {
      light: true,
      dark: true,
    },
    palette: {
      mode, // 🔥 clave para control manual
    },
  });
