"use client";

import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductos } from "@/features/dashboard/producto/hooks/useProductos";
import { ListarProducto, ListarProductosRequest } from "@/features/dashboard/producto/Producto.types";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";

const pageSizeOptions = [20, 50, 100];

const sortFieldMap: Record<string, string> = {
  nombre: "nombre",
  codigoInterno: "codigo",
  costoActual: "costo",
  createdAt: "fecha",
};

const filterFieldMap: Record<string, string> = {
  categoriaNombre: "categoriaId",
  marcaNombre: "marcaId",
  unidadMedidaNombre: "unidadMedidaId",
  isActive: "isActive",
};

function getColumns(onVer: (row: ListarProducto) => void, onEditar: (row: ListarProducto) => void) {
  const columns: GridColDef<ListarProducto>[] = [
    { field: "codigoInterno", headerName: "Código interno", flex: 1, minWidth: 140 },
    { field: "nombre", headerName: "Nombre", flex: 2, minWidth: 200 },
    { field: "marcaNombre", headerName: "Marca", flex: 1, minWidth: 140 },
    { field: "categoriaNombre", headerName: "Categoría", flex: 1, minWidth: 160 },
    {
      field: "costoActual",
      headerName: "Costo actual",
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row) => `S/ ${row.costoActual.toFixed(2)}`,
    },
    { field: "stockMinimo", headerName: "Stock mín.", flex: 1, minWidth: 110, type: "number" },
    { field: "createdByUserName", headerName: "Creado por", flex: 1, minWidth: 180 },
    {
      field: "isActive",
      headerName: "Estado",
      flex: 1,
      minWidth: 120,
      type: "boolean",
      renderCell: (params: GridRenderCellParams<ListarProducto, boolean>) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Switch checked={params.value ?? false} size="small" disabled />
          <Chip
            label={params.value ? "Activo" : "Inactivo"}
            color={params.value ? "success" : "default"}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ListarProducto>) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Tooltip title="Ver detalle">
              <IconButton size="small" color="info" onClick={() => onVer(row)}>
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton size="small" color="primary" onClick={() => onEditar(row)}>
                <ModeEditOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return columns;
}

export default function ListarProductos() {
  const mounted = useMounted();
  const router = useRouter();

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarProductos) : false;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params: ListarProductosRequest = {
    pagina: paginationModel.page + 1,
    tamanoPagina: paginationModel.pageSize,
    busqueda: debouncedSearch || undefined,
    ordenarPor: sortModel[0] ? sortFieldMap[sortModel[0].field] || sortModel[0].field : undefined,
    ordenamiento: sortModel[0]?.sort || undefined,
    ...filterModel.items.reduce<Partial<ListarProductosRequest>>((acc, item) => {
      const backendField = filterFieldMap[item.field];
      if (!backendField) return acc;
      const key = backendField as keyof ListarProductosRequest;
      if (item.value !== undefined && item.value !== null && item.value !== "") {
        (acc as Record<string, unknown>)[key] = item.value;
      }
      return acc;
    }, {}),
  };

  const { productos, paginacion, loading } = useProductos(params);

  const handleVer = useCallback(
    (row: ListarProducto) => {
      router.push(`/dashboard/productos/${row.id}`);
    },
    [router],
  );

  const handleEditar = useCallback(
    (row: ListarProducto) => {
      router.push(`/dashboard/productos/${row.id}/editar`);
    },
    [router],
  );

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (!mounted) return null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Buscar por nombre, código o código de barras"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            },
          }}
          sx={{ maxWidth: 400, width: "100%" }}
        />
      </Box>
      <Paper sx={{ height: "auto", width: "100%", p: 2 }}>
        <DataGrid
          rows={productos}
          columns={getColumns(handleVer, handleEditar)}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          rowCount={paginacion?.totalRegistros ?? 0}
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
