import { createTheme } from "@mui/material/styles";

export const brand = {
  darkBlue: "#2563EB", // azul principal (modo claro)
  darkBlueLight: "#93C5FD", // azul claro (modo oscuro)
  darkBlueDark: "#1E3A8A", // azul oscuro (texto seleccionado claro)
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
    },
  });
