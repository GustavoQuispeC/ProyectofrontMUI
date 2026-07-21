// components/ConfirmarCancelarVacacionDialog.tsx
"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ConfirmarCancelarVacacionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  pendiente?: boolean;
}

export default function ConfirmarCancelarVacacionDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  pendiente = false,
}: ConfirmarCancelarVacacionDialogProps) {
  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={onClose}
      aria-describedby="confirmar-cancelar-dialog-description"
      role="alertdialog"
    >
      <DialogTitle>{pendiente ? "¿Cancelar vacación pendiente?" : "¿Cancelar vacación aprobada?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmar-cancelar-dialog-description">
          {pendiente
            ? "Esta acción cancelará la solicitud de vacaciones pendiente. ¿Deseas continuar?"
            : "Esta acción cancelará la solicitud de vacaciones aprobada. Los días serán reintegrados al saldo del empleado. ¿Deseas continuar?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          No, volver
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading} autoFocus>
          {loading ? "Cancelando..." : "Sí, cancelar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
