import { Suspense } from "react";
import { CircularProgress, Stack } from "@mui/material";
import ListarDespachos from "../../../components/despachos/listar-despachos/ListarDespachos";

export default function DespachosPage() {
  return (
    <Suspense
      fallback={
        <Stack sx={{ alignItems: "center", py: 8 }}>
          <CircularProgress size={32} />
        </Stack>
      }
    >
      <ListarDespachos />
    </Suspense>
  );
}
