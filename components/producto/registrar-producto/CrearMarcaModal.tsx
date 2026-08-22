"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useRegistrarMarca } from "@/features/dashboard/marca/hooks/useMarcas";

interface CrearMarcaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: number) => void;
}

export default function CrearMarcaModal({ open, onClose, onSuccess }: CrearMarcaModalProps) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { registrarMarca, loading } = useRegistrarMarca();

  const handleClose = () => {
    setNombre("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      const result = await registrarMarca({
        nombre: nombre.trim(),
        logo: null,
      });
      onSuccess(result.id);
      handleClose();
    } catch {
      // El error se muestra abajo
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nueva marca</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            margin="normal"
            label="Nombre de la marca"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError(null);
            }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
