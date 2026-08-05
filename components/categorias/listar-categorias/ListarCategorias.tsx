"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useCategorias } from "@/features/dashboard/categoria/hooks/useCategorias";
import { ListarCategoria } from "@/features/dashboard/categoria/Categoria.types";
import { formatDate } from "@/shared/utils/date";
import { getAuthUser } from "@/shared/auth/auth.service";
import { permissions } from "@/shared/auth/auth.permissions";
import { hasPermission } from "@/shared/auth/auth.helper";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";

function ImageWithLoader({ src, alt }: { src?: string | null; alt?: string }) {
  const [loading, setLoading] = useState(!!src);

  if (!src) {
    return (
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "grey.100",
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: 50,
        height: 50,
        position: "relative",
        borderRadius: 1,
        overflow: "hidden",
        bgcolor: "grey.100",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: loading ? "none" : "block",
        }}
      />
    </Box>
  );
}

const getColumns = (onEdit: (row: ListarCategoria) => void, canEdit: boolean): GridColDef<ListarCategoria>[] => [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "imagen",
    headerName: "IMAGEN",
    width: 100,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ImageWithLoader src={params.value} alt={params.row.nombre} />
      </Box>
    ),
  },
  {
    field: "nombre",
    headerName: "NOMBRE",
    flex: 2,
    minWidth: 180,
  },
  {
    field: "orden",
    headerName: "ORDEN",
    width: 100,
    headerAlign: "center",
    renderCell: (params) => <Box sx={{ width: "100%", textAlign: "center" }}>{params.value}</Box>,
  },

  {
    field: "createdAt",
    headerName: "FECHA DE CREACIÓN",
    minWidth: 160,
    valueFormatter: (value) => formatDate(value),
  },
  {
    field: "createdByUserName",
    headerName: "CREADO POR",
    flex: 1,
    minWidth: 200,
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
    width: 120,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams<ListarCategoria>) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title={canEdit ? "Editar" : "No tienes permisos para editar categorías"}>
          <span>
            <IconButton size="small" color="inherit" disabled={!canEdit} onClick={() => onEdit(params.row)}>
              <ModeEditOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    ),
  },
];

const paginationModel = { page: 0, pageSize: 20 };

const gridInitialState = { pagination: { paginationModel } };

export default function ListarCategorias() {
  const { categorias, loading } = useCategorias(true);
  const mounted = useMounted();
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarCategorias) : false;
  const canEdit = user ? hasPermission(user.rol, permissions.editarCategoria) : false;

  const handleEdit = useCallback(
    (row: ListarCategoria) => {
      router.push(`/dashboard/categorias/${row.id}/editar`);
    },
    [router],
  );

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (!mounted) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Paper sx={{ height: "auto", width: "100%", p: 2 }}>
        <DataGrid
          rows={categorias}
          columns={getColumns(handleEdit, canEdit)}
          loading={loading}
          initialState={gridInitialState}
          pageSizeOptions={[20, 50, 100]}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "action.hover",
              fontWeight: 600,
            },
          }}
        />
      </Paper>
    </Box>
  );
}
