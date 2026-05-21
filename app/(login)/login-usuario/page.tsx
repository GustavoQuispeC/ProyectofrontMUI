"use client";

import LoginUsuario from "@/components/usuario/login-usuario/LoginUsuario";
import { useMounted } from "@/shared/hooks/useMounted";

export default function LoginUsuarioPage() {
  const mounted = useMounted();

  if (!mounted) return null;
  
  return <LoginUsuario />;
}
