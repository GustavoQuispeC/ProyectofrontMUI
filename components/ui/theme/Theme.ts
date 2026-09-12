import { createTheme } from "@mui/material/styles";

export const brand = {
  darkBlue: "#0b43c7",
  darkBlueLight: "#334155",
  darkBlueDark: "#020617",
  orange: "#F97316",
  orangeLight: "#FDBA74",
  orangeDark: "#C2410C",
  black: "#000000",
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
    },
  });
