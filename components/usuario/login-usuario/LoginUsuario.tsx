"use client";

import React, { useMemo, useState } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { toastError, toastSuccess } from "@/shared/utils/toast";
import { loginUsuarioApi } from "@/components/features/dashboard/usuario/usuario.service";

type LoginPageProps = {
  forgotHref?: string;
  brandName?: string;
  storageKey?: string;
};

export default function LoginUsuario({
  forgotHref = "/intranet/recuperar-password",
  brandName = "Grupo Famet",
  storageKey = "auth_usuario",
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(email.trim());
    return emailOk && password.trim().length > 0 && !isLoading;
  }, [email, password, isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);

      const payload = await loginUsuarioApi(email.trim(), password);

      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      }

      toastSuccess("Bienvenido al sistema");

      setTimeout(() => {
        window.location.assign("/dashboard");
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Credenciales inválidas";
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-black dark:from-black dark:via-neutral-950 dark:to-black">
      {/* Glow decorations */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 shadow-xl shadow-orange-600/30 mb-4">
            <BusinessIcon className="text-white" style={{ fontSize: 30 }} />
          </div>
          <h1 className="text-3xl font-bold text-white">Portal Corporativo</h1>
          <p className="text-sm text-neutral-300 mt-2 font-medium">{brandName} • Acceso de Empleados</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl">
          <div className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">Correo Electrónico</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-neutral-400 flex items-center pointer-events-none">
                    <EmailOutlinedIcon style={{ fontSize: 18 }} />
                  </span>
                  <input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full h-12 pl-10 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm shadow-sm placeholder:text-neutral-400 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-neutral-700 dark:text-neutral-300 font-medium text-sm">Contraseña</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-neutral-400 flex items-center pointer-events-none">
                    <LockOutlinedIcon style={{ fontSize: 18 }} />
                  </span>
                  <input
                    type={isVisible ? "text" : "password"}
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg(null);
                    }}
                    className="w-full h-12 pl-10 pr-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm shadow-sm placeholder:text-neutral-400 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-neutral-400 hover:text-orange-600 transition flex items-center"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <VisibilityOffIcon style={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityIcon style={{ fontSize: 18 }} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end pt-1">
                  <a href={forgotHref} className="text-xs font-semibold text-orange-600 hover:underline">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="flex gap-2 items-center bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg p-3 text-sm">
                  <ErrorOutlineOutlinedIcon style={{ fontSize: 16 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold shadow-lg shadow-orange-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {isLoading ? (
                  <>
                    <AutorenewIcon style={{ fontSize: 18 }} className="animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ChevronRightIcon style={{ fontSize: 18 }} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <div className="w-1/3 h-px bg-neutral-600 opacity-40" />
          <p className="text-[11px] uppercase tracking-widest text-neutral-400">Sistema Corporativo Seguro</p>
          <p className="text-[10px] text-neutral-500">
            © {new Date().getFullYear()} {brandName}
          </p>
        </div>
      </div>
    </main>
  );
}
