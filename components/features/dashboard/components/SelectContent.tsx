import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { styled, alpha } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Box, Typography } from "@mui/material";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 26,
  height: 26,
  borderRadius: 6,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  "& svg": { fontSize: "0.85rem" },
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 10,
});

const items = [
  { value: "", label: "Sitemark-web", sub: "Web app", icon: <DevicesRoundedIcon />, group: "prod" },
  { value: "10", label: "Sitemark-app", sub: "Mobile application", icon: <SmartphoneRoundedIcon />, group: "prod" },
  { value: "20", label: "Sitemark-Store", sub: "Web app", icon: <DevicesRoundedIcon />, group: "prod" },
  { value: "30", label: "Sitemark-Admin", sub: "Web app", icon: <ConstructionRoundedIcon />, group: "dev" },
];

export default function SelectContent() {
  const [company, setCompany] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => setCompany(event.target.value);
  const selected = items.find((i) => i.value === company) ?? items[0];

  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={company}
      onChange={handleChange}
      displayEmpty
      renderValue={() => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar>{selected.icon}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
              {selected.label}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {selected.sub}
            </Typography>
          </Box>
        </Box>
      )}
      fullWidth
      sx={{
        width: 240,
        [`& .${selectClasses.select}`]: { display: "flex", alignItems: "center", py: 1, pl: 1.5 },
      }}
    >
      <ListSubheader sx={{ pt: 0, fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Producción
      </ListSubheader>
      {items
        .filter((i) => i.group === "prod")
        .map((item) => (
          <MenuItem key={item.value} value={item.value} sx={{ gap: 0 }}>
            <ListItemAvatar>
              <Avatar>{item.icon}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.label} secondary={item.sub} />
            {company === item.value && <FiberManualRecordIcon sx={{ fontSize: 8, color: "info.main", ml: 1 }} />}
          </MenuItem>
        ))}
      <ListSubheader sx={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        Desarrollo
      </ListSubheader>
      {items
        .filter((i) => i.group === "dev")
        .map((item) => (
          <MenuItem key={item.value} value={item.value}>
            <ListItemAvatar>
              <Avatar>{item.icon}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.label} secondary={item.sub} />
            {company === item.value && <FiberManualRecordIcon sx={{ fontSize: 8, color: "info.main", ml: 1 }} />}
          </MenuItem>
        ))}
      <Divider sx={{ mx: -1 }} />
      <MenuItem value="add" sx={{ color: "info.main" }}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: alpha("#0288d1", 0.1), color: "info.main", border: "none" }}>
            <AddRoundedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Agregar producto" secondary="Conectar nuevo proyecto" />
      </MenuItem>
    </Select>
  );
}
