import Image from "next/image";
import { Box } from "@mui/material";

interface SelectContentProps {
  open?: boolean;
}

export default function SelectContent({ open = true }: SelectContentProps) {
  if (!open) return null;

  const width = 95;
  const height = Math.round((width * 2216) / 4500);
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
      <Image
        src="/LogoFamet2.png"
        alt="Grupo Famet"
        width={width}
        height={height}
        style={{ objectFit: "contain" }}
        priority
      />
    </Box>
  );
}
