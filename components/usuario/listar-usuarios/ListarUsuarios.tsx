"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useUsuarios } from "@/features/dashboard/usuario/hooks/useUsuarios";
import { useCambiarEstadoUsuario } from "@/features/dashboard/usuario/hooks/useCambiarEstadoUsuario";
import { useResetPassword } from "@/features/dashboard/usuario/hooks/useResetPassword";
import { useCambiarCorreoUsuario } from "@/features/dashboard/usuario/hooks/useCambiarCorreoUsuario";
import { useCambiarRolUsuario } from "@/features/dashboard/usuario/hooks/useCambiarRolUsuario";
import { useRoles } from "@/features/dashboard/roles/hooks/useRoles";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { ListarUsuarios } from "@/features/dashboard/usuario";
import { toastPromise } from "@/shared/utils/toast";

const getColumns = (
  onToggle: (row: ListarUsuarios, nuevoEstado: boolean) => void,
  onReset: (row: ListarUsuarios) => void,
  onChangeEmail: (row: ListarUsuarios) => void,
  onChangeRole: (row: ListarUsuarios) => void,
  isLoading: boolean,
  isResetting: boolean,
  isChangingEmail: boolean,
  isChangingRole: boolean,
): GridColDef[] => [
  {
    field: "numeroDocumento",
    headerName: "N° DOCUMENTO",
    width: 130,
  },
  {
    field: "nombreEmpleado",
    headerName: "NOMBRES Y APELLIDOS",
    width: 200,
    flex: 1,
  },
  {
    field: "email",
    headerName: "CORREO",
    width: 180,
    flex: 1,
  },
  {
    field: "roles",
    headerName: "ROL",
    width: 150,
    renderCell: (params) => params.value?.join(", "),
  },
  {
    field: "isActive",
    headerName: "ESTADO",
    width: 120,
    renderCell: (params) => {
      const isActive = params.value;

      return (
        <Chip
          label={isActive ? "Activo" : "Inactivo"}
          size="small"
          sx={{
            width: 90,
            justifyContent: "center",
            fontWeight: 500,
            // estilo tipo Alert
            bgcolor: isActive ? "success.light" : "error.light",
            color: isActive ? "success.contrastText" : "error.contrastText",
          }}
        />
      );
    },
  },
  {
    field: "actions",
    headerName: "ACCIONES",
    width: 220,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: "100%" }}>
        <Tooltip title="Cambiar rol">
          <IconButton
            size="small"
            color="error"
            onClick={() => onChangeRole(params.row)}
            disabled={isChangingRole || !params.row.userId}
          >
            <PersonIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={params.row.isActive ? "Desactivar" : "Activar"}>
          <Switch
            checked={params.row.isActive}
            onChange={(e) => onToggle(params.row, e.target.checked)}
            disabled={isLoading || !params.row.userId}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Cambiar correo">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => onChangeEmail(params.row)}
            disabled={isChangingEmail || !params.row.userId}
          >
            <EmailIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Resetear contraseña">
          <IconButton
            size="small"
            color="warning"
            onClick={() => onReset(params.row)}
            disabled={isResetting || !params.row.userId}
          >
            <KeyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

const passwordErrorMap: Record<string, string> = {
  "Passwords must have at least one non alphanumeric character ":
    "La contraseña debe tener al menos un carácter no alfanumérico",
  "Passwords must have at least one lowercase ('a'-'z')": "La contraseña debe tener al menos una minúscula",
  "Passwords must have at least one uppercase ('A'-'Z')": "La contraseña debe tener al menos una mayúscula",
  "Passwords must have at least one digit ('0'-'9')": "La contraseña debe tener al menos un dígito",
};

function translatePasswordErrors(message: string): string {
  let translated = message;
  Object.entries(passwordErrorMap).forEach(([en, es]) => {
    translated = translated.replaceAll(en, es);
  });
  return translated;
}

const paginationModel = { page: 0, pageSize: 10 };
const gridInitialState = { pagination: { paginationModel } };

export default function ListarUsuariosDataTable() {
  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarUsuarios) : false;
  const { usuarios, loading } = useUsuarios(canAccess);
  const { cambiarEstadoUsuario, loading: isChanging } = useCambiarEstadoUsuario();
  const { resetPasswordUsuario, loading: isResetting } = useResetPassword();
  const { cambiarCorreoUsuario, loading: isChangingEmail } = useCambiarCorreoUsuario();
  const { cambiarRolUsuario, loading: isChangingRole } = useCambiarRolUsuario();
  const { roles } = useRoles();
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ListarUsuarios | null>(null);
  const [pendingEstado, setPendingEstado] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedResetUser, setSelectedResetUser] = useState<ListarUsuarios | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedEmailUser, setSelectedEmailUser] = useState<ListarUsuarios | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = useState<ListarUsuarios | null>(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const localeText = useMemo(() => esES.components.MuiDataGrid.defaultProps.localeText, []);

  const handleToggle = useCallback((row: ListarUsuarios, nuevoEstado: boolean) => {
    setSelectedUser(row);
    setPendingEstado(nuevoEstado);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedUser(null);
  }, []);

  const handleReset = useCallback((row: ListarUsuarios) => {
    setSelectedResetUser(row);
    setResetDialogOpen(true);
  }, []);

  const handleCloseResetDialog = useCallback(() => {
    setResetDialogOpen(false);
    setSelectedResetUser(null);
    setResetPassword("");
    setShowPassword(false);
  }, []);

  const handleConfirmReset = useCallback(async () => {
    if (!selectedResetUser?.userId || !resetPassword.trim()) return;

    await toastPromise(resetPasswordUsuario({ usuarioId: selectedResetUser.userId, password: resetPassword.trim() }), {
      loading: "Reseteando contraseña...",
      success: "Contraseña reseteada correctamente",
      error: (error) => translatePasswordErrors(error.message),
    });

    handleCloseResetDialog();
  }, [selectedResetUser, resetPassword, resetPasswordUsuario, handleCloseResetDialog]);

  const handleOpenEmail = useCallback((row: ListarUsuarios) => {
    setSelectedEmailUser(row);
    setEmailDialogOpen(true);
  }, []);

  const handleCloseEmailDialog = useCallback(() => {
    setEmailDialogOpen(false);
    setSelectedEmailUser(null);
    setNewEmail("");
  }, []);

  const handleConfirmEmail = useCallback(async () => {
    if (!selectedEmailUser?.userId || !newEmail.trim()) return;

    await toastPromise(cambiarCorreoUsuario({ usuarioId: selectedEmailUser.userId, email: newEmail.trim() }), {
      loading: "Actualizando correo...",
      success: "Correo actualizado correctamente",
      error: (error) => error.message,
    });

    handleCloseEmailDialog();
  }, [selectedEmailUser, newEmail, cambiarCorreoUsuario, handleCloseEmailDialog]);

  const handleOpenRole = useCallback(
    (row: ListarUsuarios) => {
      setSelectedRoleUser(row);
      const currentRoleName = row.roles?.[0] ?? "";
      const currentRoleId = roles.find((r) => r.name === currentRoleName)?.id ?? "";
      setSelectedRole(currentRoleId);
      setRoleDialogOpen(true);
    },
    [roles],
  );

  const handleCloseRoleDialog = useCallback(() => {
    setRoleDialogOpen(false);
    setSelectedRoleUser(null);
    setSelectedRole("");
  }, []);

  const handleConfirmRole = useCallback(async () => {
    if (!selectedRoleUser?.userId || !selectedRole) return;

    await toastPromise(cambiarRolUsuario({ usuarioId: selectedRoleUser.userId, role: selectedRole }), {
      loading: "Actualizando rol...",
      success: "Rol actualizado correctamente",
      error: (error) => error.message,
    });

    handleCloseRoleDialog();
  }, [selectedRoleUser, selectedRole, cambiarRolUsuario, handleCloseRoleDialog]);

  const handleConfirm = useCallback(async () => {
    if (!selectedUser?.userId) return;

    await toastPromise(cambiarEstadoUsuario({ usuarioId: selectedUser.userId, estado: pendingEstado }), {
      loading: "Actualizando estado...",
      success: `Usuario ${pendingEstado ? "activado" : "desactivado"} correctamente`,
      error: (error) => error.message,
    });

    handleCloseDialog();
  }, [selectedUser, pendingEstado, cambiarEstadoUsuario, handleCloseDialog]);

  const columns = useMemo(
    () =>
      getColumns(
        handleToggle,
        handleReset,
        handleOpenEmail,
        handleOpenRole,
        isChanging,
        isResetting,
        isChangingEmail,
        isChangingRole,
      ),
    [
      handleToggle,
      handleReset,
      handleOpenEmail,
      handleOpenRole,
      isChanging,
      isResetting,
      isChangingEmail,
      isChangingRole,
    ],
  );

  if (!mounted) return null;

  if (!canAccess) {
    return <AccessDenied />;
  }
  return (
    <Paper sx={{ height: "100%", width: "100%", mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <Button
          component={Link}
          href="/dashboard/usuarios/registrar"
          variant="contained"
          startIcon={<GroupAddIcon />}
          sx={{ height: 44, width: { xs: "100%", sm: "auto" } }}
        >
          Nuevo Usuario
        </Button>
      </Box>
      <DataGrid
        rows={usuarios}
        columns={columns}
        getRowId={(row) => row.numeroDocumento}
        loading={loading}
        initialState={gridInitialState}
        pageSizeOptions={[5, 10]}
        localeText={localeText}
        sx={{
          border: 0,
          mx: 1,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#e4eaeb",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            color: "#006064",
          },
        }}
      />
      {/* Dialog para cambiar estado */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{pendingEstado ? "Activar usuario" : "Desactivar usuario"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            ¿Estás seguro de que deseas {pendingEstado ? "activar" : "desactivar"} al usuario{" "}
            <strong>{selectedUser?.nombreEmpleado ?? selectedUser?.email}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isChanging} sx={{ minWidth: 120, height: 44 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={pendingEstado ? "success" : "error"}
            disabled={isChanging || !selectedUser?.userId}
            sx={{ minWidth: 120, height: 44 }}
          >
            {pendingEstado ? "Activar" : "Desactivar"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog para resetear contraseña */}
      <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Resetear contraseña</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Ingrese la nueva contraseña para{" "}
            <strong>{selectedResetUser?.nombreEmpleado ?? selectedResetUser?.email}</strong>:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nueva contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
            disabled={isResetting}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      disabled={isResetting}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog} disabled={isResetting} sx={{ minWidth: 120, height: 44 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmReset}
            variant="contained"
            color="warning"
            disabled={isResetting || !selectedResetUser?.userId || !resetPassword.trim()}
            sx={{ minWidth: 120, height: 44 }}
          >
            Resetear
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog para cambiar correo */}
      <Dialog open={emailDialogOpen} onClose={handleCloseEmailDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Cambiar correo</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Ingrese el nuevo correo para{" "}
            <strong>{selectedEmailUser?.nombreEmpleado ?? selectedEmailUser?.email}</strong>:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Nuevo correo"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={isChangingEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} disabled={isChangingEmail} sx={{ minWidth: 120, height: 44 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmEmail}
            variant="contained"
            color="secondary"
            disabled={isChangingEmail || !selectedEmailUser?.userId || !newEmail.trim()}
            sx={{ minWidth: 120, height: 44 }}
          >
            Cambiar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog para cambiar rol */}
      <Dialog open={roleDialogOpen} onClose={handleCloseRoleDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Cambiar rol</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Seleccione el nuevo rol para <strong>{selectedRoleUser?.nombreEmpleado ?? selectedRoleUser?.email}</strong>:
          </Typography>
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Rol</InputLabel>
            <Select
              labelId="role-select-label"
              value={selectedRole}
              label="Rol"
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={isChangingRole}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog} disabled={isChangingRole} sx={{ minWidth: 120, height: 44 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmRole}
            variant="contained"
            color="error"
            disabled={isChangingRole || !selectedRoleUser?.userId || !selectedRole}
            sx={{ minWidth: 120, height: 44 }}
          >
            Cambiar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
