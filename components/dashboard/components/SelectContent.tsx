import Image from "next/image";
import { Box } from "@mui/material";

interface SelectContentProps {
  open?: boolean;
}

export default function SelectContent({ open = true }: SelectContentProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: open ? "flex-start" : "center", alignItems: "center", width: "100%" }}>
      <Image
        src="/LogoFamet2.png"
        alt="Grupo Famet"
        width={open ? 95 : 22}
        height={open ? 35 : 22}
        style={{ objectFit: "contain" }}
      />
    </Box>
  );
}
