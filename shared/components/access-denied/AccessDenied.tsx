"use client";

import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldOffIcon from "@mui/icons-material/GppBadOutlined";

import { useRouter } from "next/navigation";

type Props = {
  message?: string;
  redirectTo?: string;
  errorCode?: string;
};

export default function AccessDenied({
  message = "No tienes permisos suficientes para acceder a este módulo. Si crees que esto es un error, contacta con el administrador del sistema.",
  redirectTo = "/dashboard",
  errorCode = "403 Forbidden",
}: Props) {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "white",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 440,
          width: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Top accent stripe */}
        <Box sx={{ height: 3, bgcolor: "error.dark" }} />

        <Box sx={{ p: "2.5rem 2rem 2rem" }}>
          {/* Icon + badge row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: "error.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                "& svg": { color: "error.dark", fontSize: 20 },
              }}
            >
              <ShieldOffIcon fontSize="small" />
            </Box>
            <Chip
              label="Acceso denegado"
              size="small"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                bgcolor: "error.50",
                color: "error.dark",
                border: "1px solid",
                borderColor: "error.200",
                borderRadius: "4px",
              }}
            />
          </Box>

          {/* Heading */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.2rem",
              mb: 1,
              lineHeight: 1.3,
              color: "text.primary",
            }}
          >
            No tienes permiso para acceder a este módulo
          </Typography>

          {/* Message */}
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, mb: "1.75rem" }}>
            {message}
          </Typography>

          <Divider sx={{ mb: "1.5rem" }} />

          {/* Error code meta */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mb: "1.5rem",
              color: "text.disabled",
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontSize: "0.72rem" }}>
              Código de error:{" "}
              <Box component="span" sx={{ fontWeight: 600 }}>
                {errorCode}
              </Box>
            </Typography>
          </Box>

          {/* Back button */}
          <Button
            variant="outlined"
            size="medium"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(redirectTo)}
            sx={{
              borderColor: "divider",
              color: "text.primary",
              fontWeight: 500,
              fontSize: "0.875rem",
              textTransform: "none",
              borderRadius: 1.5,
              px: 2.5,
              py: 1,
              "&:hover": {
                bgcolor: "grey.50",
                borderColor: "grey.400",
              },
            }}
          >
            Volver al panel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
