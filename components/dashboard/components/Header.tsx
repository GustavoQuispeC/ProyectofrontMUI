import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
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
        pb: 1,
        // separación visual inferior coherente con el Drawer
        borderBottom: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <NavbarBreadcrumbs />

      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        {/* DatePicker alineado visualmente con los IconButtons */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            defaultValue={dayjs()}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  width: 150,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.8125rem", // 13px — igual que los breadcrumbs
                    "& fieldset": {
                      borderWidth: "0.5px",
                      borderColor: "divider",
                    },
                    "&:hover fieldset": {
                      borderColor: "text.secondary",
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: "6px",
                    px: 1.25,
                  },
                },
              },
              // icono del calendario alineado
              openPickerButton: {
                size: "small",
                sx: { color: "text.secondary" },
              },
            }}
          />
        </LocalizationProvider>

        {/* Notificaciones con Badge */}
        <Tooltip title="Notificaciones" placement="bottom">
          <IconButton
            size="small"
            aria-label="Abrir notificaciones"
            sx={{
              width: 34,
              height: 34,
              border: "0.5px solid",
              borderColor: "divider",
              borderRadius: "8px",
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
                borderColor: "text.secondary",
              },
            }}
          >
            <Badge
              badgeContent=""
              variant="dot"
              color="error"
              sx={{
                "& .MuiBadge-dot": {
                  width: 6,
                  height: 6,
                  minWidth: 6,
                  top: 2,
                  right: 2,
                },
              }}
            >
              <NotificationsRoundedIcon sx={{ fontSize: "1.1rem" }} />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Cambiar tema" placement="bottom">
          <ColorModeToggleButton />
        </Tooltip>
      </Stack>
    </Stack>
  );
}
