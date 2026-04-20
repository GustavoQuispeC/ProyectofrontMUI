import Stack from "@mui/material/Stack";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import MenuButton from "./MenuButton";
import ColorModeToggleButton from "@/components/ui/theme/ColorModeToggleButton";
import dayjs from "dayjs";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: "none", md: "flex" },
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
        pt: 1.5,
      }}
    >
      <NavbarBreadcrumbs />

      {/* 🔥 LADO DERECHO */}
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        {/* 📅 DATE PICKER */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs()} // ✅ siempre fecha actual
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small", // ✅ reduce altura
              },
            }}
          />
        </LocalizationProvider>

        {/* 🔔 NOTIFICACIONES */}
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>

        <ColorModeToggleButton />
      </Stack>
    </Stack>
  );
}
