"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useRegistrarCategoria } from "@/features/dashboard/categoria/hooks/useCategorias";

interface CrearCategoriaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (id: number) => void;
  categoriaPadreId?: number | null;
}

export default function CrearCategoriaModal({ open, onClose, onSuccess, categoriaPadreId }: CrearCategoriaModalProps) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { registrarCategoria, loading } = useRegistrarCategoria();

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
      const result = await registrarCategoria({
        nombre: nombre.trim(),
        descripcion: null,
        imagen: null,
        orden: 0,
        categoriaPadreId: categoriaPadreId ?? null,
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
        <DialogTitle>Nueva categoría</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            margin="normal"
            label="Nombre de la categoría"
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
