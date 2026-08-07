"use client";

import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import Image from "next/image";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ImageIcon from "@mui/icons-material/Image";
import { esES } from "@mui/x-data-grid/locales";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductos } from "@/features/dashboard/producto/hooks/useProductos";
import { useCategorias } from "@/features/dashboard/categoria/hooks/useCategorias";
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

function Thumbnail({ url, nombre }: { url: string | null; nombre: string }) {
  const [loaded, setLoaded] = useState(false);
  const hasImage = Boolean(url);

  if (!hasImage) {
    return (
      <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: "grey.200" }}>
        <ImageIcon sx={{ color: "grey.500" }} />
      </Avatar>
    );
  }

  return (
    <Box sx={{ position: "relative", width: 40, height: 40 }}>
      {!loaded && (
        <CircularProgress
          size={20}
          sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      )}
      <Image
        src={url!}
        alt={nombre}
        width={40}
        height={40}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{
          objectFit: "cover",
          borderRadius: 4,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      />
    </Box>
  );
}

function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        zIndex: 1,
      }}
    >
      <CircularProgress size={32} />
    </Box>
  );
}

function getColumns(onVer: (row: ListarProducto) => void, onEditar: (row: ListarProducto) => void) {
  const columns: GridColDef<ListarProducto>[] = [
    { field: "codigoInterno", headerName: "Cód. interno", flex: 1, minWidth: 120 },
    {
      field: "imagen",
      headerName: "Imagen",
      width: 80,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ListarProducto>) => {
        const url = params.row.imagenes.find((img) => img.esPrincipal)?.url || params.row.imagenes[0]?.url || null;
        return <Thumbnail url={url} nombre={params.row.nombre} />;
      },
    },
    { field: "nombre", headerName: "Nombre", flex: 2, minWidth: 200 },
    { field: "marcaNombre", headerName: "Marca", flex: 1, minWidth: 120 },
    { field: "categoriaNombre", headerName: "Categoría", flex: 1, minWidth: 160 },
    {
      field: "costoActual",
      headerName: "Costo actual",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      valueGetter: (_value, row) => `S/ ${row.costoActual.toFixed(2)}`,
    },
    {
      field: "stockMinimo",
      headerName: "Stock mín.",
      flex: 1,
      minWidth: 110,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    { field: "createdByUserName", headerName: "Creado por:", flex: 1, minWidth: 180 },
    {
      field: "isActive",
      headerName: "Estado",
      flex: 1,
      minWidth: 100,
      type: "boolean",
      renderCell: (params: GridRenderCellParams<ListarProducto, boolean>) => (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
          <Switch checked={params.value ?? false} size="small" color={params.value ? "primary" : "error"} />
        </Box>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<ListarProducto>) => {
        const row = params.row;
        return (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
            <Tooltip title="Ver detalle">
              <IconButton size="small" color="primary" onClick={() => onVer(row)}>
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton size="small" color="secondary" onClick={() => onEditar(row)}>
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
  const canCreate = user ? hasPermission(user.rol, permissions.registrarProducto) : false;

  const { categorias } = useCategorias(canAccess);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [estado, setEstado] = useState<string>("");

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params: ListarProductosRequest = {
    pagina: paginationModel.page + 1,
    tamanoPagina: paginationModel.pageSize,
    busqueda: debouncedSearch || undefined,
    categoriaId: categoriaId ? Number(categoriaId) : undefined,
    isActive: estado === "" ? undefined : estado === "true",
    ordenarPor: sortModel[0] ? sortFieldMap[sortModel[0].field] || sortModel[0].field : undefined,
    ordenamiento: sortModel[0]?.sort || undefined,
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
      router.push(`/dashboard/productos/editar/${row.id}`);
    },
    [router],
  );

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (!mounted) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", flex: 1 }}>
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
            sx={{ minWidth: 280, flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="categoria-filter-label">Categoría</InputLabel>
            <Select
              labelId="categoria-filter-label"
              label="Categoría"
              value={categoriaId}
              onChange={(e) => {
                setCategoriaId(e.target.value);
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={String(cat.id)}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              label="Estado"
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
                setPaginationModel((prev) => ({ ...prev, page: 0 }));
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Activo</MenuItem>
              <MenuItem value="false">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {canCreate && (
          <Button
            component={Link}
            href="/dashboard/productos/registrar"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ height: 40 }}
          >
            Agregar producto
          </Button>
        )}
      </Box>
      <Paper sx={{ height: "auto", width: "100%", p: 2 }}>
        <DataGrid
          rows={productos}
          columns={getColumns(handleVer, handleEditar)}
          loading={loading}
          slots={{ loadingOverlay: LoadingOverlay }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          rowCount={paginacion?.totalRegistros ?? 0}
          getRowId={(row) => row.id}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            border: 0,
            mx: 1,
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#e4eaeb",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 700,
              color: "#006064",
              textTransform: "uppercase",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
