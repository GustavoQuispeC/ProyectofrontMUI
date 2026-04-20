"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import IconButton, { IconButtonOwnProps } from "@mui/material/IconButton";
import { useThemeMode } from "./ThemeRegistry";

export default function ColorModeToggleButton(props: IconButtonOwnProps) {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <IconButton
      onClick={toggleTheme}
      disableRipple
      size="small"
      aria-label="Toggle dark mode"
      {...props}
    >
      {mode === "dark" ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
    </IconButton>
  );
}