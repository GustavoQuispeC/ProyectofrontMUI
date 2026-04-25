import { ILoginResponse, IUserData } from "@/shared/auth/types/IAuth";
import { jwtDecode } from "jwt-decode";

const AUTH_KEY = "auth_usuario";
const ROL_KEY = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

//! Función para verificar si el código se está ejecutando en el cliente (navegador)
type JwtPayload = {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  exp?: number;
};

const isClient = () => typeof window !== "undefined";

//! Función para extraer el rol del token JWT
const extractRolFromToken = (token: string): string => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const raw = decoded[ROL_KEY];
    return (Array.isArray(raw) ? raw[0] : raw) ?? "Usuario";
  } catch {
    return "Usuario";
  }
};

//! Función para guardar los datos de autenticación
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

//! Función para obtener los datos del usuario autenticado
export const getAuthUser = (): IUserData | null => {
  if (!isClient()) return null;

  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const parsed: IUserData = JSON.parse(raw);

    return {
      ...parsed,
      rol: parsed.rol ?? extractRolFromToken(parsed.token),
    };
  } catch (error) {
    console.error("❌ Error al leer sesión:", error);
    return null;
  }
};

//! Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  if (!isClient()) return false;

  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return false;

  try {
    const { token } = JSON.parse(raw) as IUserData;
    const decoded = jwtDecode<JwtPayload>(token);

    return !!decoded.exp && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

//! Función para obtener el token de autenticación
export const getToken = (): string | null => {
  const user = getAuthUser();
  return user?.token ?? null;
};

//! Función para cerrar sesión
export const logout = (): void => {
  if (!isClient()) return;
  localStorage.removeItem(AUTH_KEY);
};
