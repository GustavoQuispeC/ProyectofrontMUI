import { getAuthUser } from "./auth.service";
import { getApiErrorMessage } from "@/lib/api-error";

const TERMINAL_KEY = "terminal_seleccionada";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface Terminal {
  id: number;
  nombre: string;
  codigo: string;
  tiendaId: number;
  tiendaNombre: string;
  isActive: boolean;
}

export async function listarTerminalesApi(): Promise<Terminal[]> {
  const auth = getAuthUser();
  const response = await fetch(`${apiUrl}/terminal`, {
    headers: auth?.token ? { Authorization: `Bearer ${auth.token}` } : {},
  });

  if (!response.ok) throw new Error(await getApiErrorMessage(response));

  const terminales = (await response.json()) as Terminal[];
  return terminales.filter((terminal) => terminal.isActive);
}

export function getTerminalSeleccionada(): Terminal | null {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(TERMINAL_KEY);
    return value ? (JSON.parse(value) as Terminal) : null;
  } catch {
    return null;
  }
}

export function guardarTerminalSeleccionada(terminal: Terminal): void {
  localStorage.setItem(TERMINAL_KEY, JSON.stringify(terminal));
  window.dispatchEvent(new Event("terminal-seleccionada"));
}

export function limpiarTerminalSeleccionada(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TERMINAL_KEY);
  window.dispatchEvent(new Event("terminal-seleccionada"));
}
