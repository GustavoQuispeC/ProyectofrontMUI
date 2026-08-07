"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import { useProducto } from "@/features/dashboard/producto/hooks/useProductos";
import { getAuthUser } from "@/shared/auth/auth.service";
import { hasPermission } from "@/shared/auth/auth.helper";
import { permissions } from "@/shared/auth/auth.permissions";
import AccessDenied from "@/shared/components/access-denied/AccessDenied";
import { useMounted } from "@/shared/hooks/useMounted";

interface VerProductoProps {
  id: string;
}

export default function VerProducto({ id }: VerProductoProps) {
  const router = useRouter();
  const mounted = useMounted();
  const { producto, loading, error } = useProducto(id);

  const user = getAuthUser();
  const canAccess = user ? hasPermission(user.rol, permissions.listarProductos) : false;

  if (!canAccess) {
    return <AccessDenied />;
  }

  if (!mounted) return null;

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando producto...</Typography>
      </Box>
    );
  }

  if (error || !producto) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || "No se encontró el producto"}</Typography>
        <Button
          variant="outlined"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => router.push("/dashboard/productos/listar")}
          sx={{ mt: 2 }}
        >
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Detalle del producto
        </Typography>
        <Button
          variant="outlined"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => router.push("/dashboard/productos/listar")}
        >
          Volver
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
          <Box sx={{ width: { xs: "100%", md: "33%" }, flexShrink: 0 }}>
            {producto.imagenes.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {producto.imagenes
                  .slice()
                  .sort((a, b) => a.orden - b.orden)
                  .map((img) => (
                    <Box
                      key={img.id}
                      sx={{
                        position: "relative",
                        width: { xs: "calc(50% - 4px)", md: "calc(50% - 4px)" },
                        aspectRatio: "1 / 1",
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "grey.100",
                      }}
                    >
                      <Box
                        component="img"
                        src={img.url || undefined}
                        alt={producto.nombre}
                        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                      {img.esPrincipal && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "warning.main",
                            borderRadius: "50%",
                            p: 0.5,
                            display: "flex",
                          }}
                        >
                          <StarIcon sx={{ fontSize: 16, color: "#fff" }} />
                        </Box>
                      )}
                    </Box>
                  ))}
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  borderRadius: 2,
                }}
              >
                <Typography color="text.secondary">Sin imagen</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {producto.nombre}
              </Typography>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={producto.isActive ? "Activo" : "Inactivo"}
                  color={producto.isActive ? "success" : "error"}
                />
                <Chip label={producto.categoriaNombre} variant="outlined" />
                <Chip label={producto.marcaNombre} variant="outlined" />
              </Box>

              <Divider />

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <InfoItem label="Código interno" value={producto.codigoInterno} />
                <InfoItem label="Código de barras" value={producto.codigoBarras || "—"} />
                <InfoItem label="Unidad de medida" value={producto.unidadMedidaNombre} />
                <InfoItem label="Stock mínimo" value={String(producto.stockMinimo)} />
                <InfoItem label="Costo actual" value={`S/ ${producto.costoActual.toFixed(2)}`} />
                <InfoItem label="Fecha de vencimiento" value={producto.fechaVencimiento || "—"} />
                <InfoItem label="Creado por" value={producto.createdByUserName || "—"} />
                <InfoItem label="Fecha de creación" value={new Date(producto.createdAt).toLocaleDateString()} />
              </Box>

              {producto.descripcion && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Descripción
                    </Typography>
                    <Typography>{producto.descripcion}</Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {producto.precios.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Precios
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {producto.precios.map((precio) => (
              <Paper key={precio.id} variant="outlined" sx={{ p: 2, minWidth: 260, flex: "1 1 260px" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {precio.listaPrecioNombre || "Lista de precios"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: S/ {precio.precio.toFixed(2)}
                </Typography>
                {precio.precioMinimo !== null && (
                  <Typography variant="body2" color="text.secondary">
                    Mínimo: S/ {precio.precioMinimo.toFixed(2)}
                  </Typography>
                )}
                {precio.precioMaximo !== null && (
                  <Typography variant="body2" color="text.secondary">
                    Máximo: S/ {precio.precioMaximo.toFixed(2)}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: { xs: "100%", sm: "45%" }, flex: "1 1 45%" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  );
}
