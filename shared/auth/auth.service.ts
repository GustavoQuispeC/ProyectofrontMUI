import { ILoginResponse, IUserData } from "@/shared/auth/types/IAuth";
import { jwtDecode } from "jwt-decode";

const AUTH_KEY = "auth_usuario";
const ROL_KEY = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type JwtPayload = {
  [ROL_KEY]?: string | string[];
  exp?: number;
};

// ── Utilidades privadas ──────────────────────────────────────────────────────

const isClient = () => typeof window !== "undefined";

const extractRolFromToken = (token: string): string => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const raw = decoded[ROL_KEY];
    return (Array.isArray(raw) ? raw[0] : raw) ?? "Usuario";
  } catch {
    return "Usuario";
  }
};

// ── API pública ──────────────────────────────────────────────────────────────

export const saveAuthData = (data: ILoginResponse): void => {
  if (!isClient()) return;

  try {
    const authData: IUserData = {
      ...data,
      fotoUrl: data.fotoUrl ?? null,
      rol: extractRolFromToken(data.token),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error("❌ Error al guardar sesión:", error);
  }
};

export const getAuthUser = (): IUserData | null => {
  if (!isClient()) return null;

  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const parsed: IUserData = JSON.parse(raw);

    // Fallback: si el rol no fue guardado, lo extraemos del token
    if (!parsed.rol && parsed.token) {
      parsed.rol = extractRolFromToken(parsed.token);
    }

    return parsed;
  } catch (error) {
    console.error("❌ Error al leer sesión:", error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getAuthUser();
  if (!user) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(user.token);
    if (!decoded.exp) return false;

    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const logout = (): void => {
  if (!isClient()) return;
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/";
};
