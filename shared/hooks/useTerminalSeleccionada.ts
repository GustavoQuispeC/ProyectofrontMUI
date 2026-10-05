import { useEffect, useState } from "react";
import { getTerminalSeleccionada, Terminal } from "@/shared/auth/terminal.service";

export function useTerminalSeleccionada() {
  const [terminal, setTerminal] = useState<Terminal | null>(() => getTerminalSeleccionada());

  useEffect(() => {
    const actualizar = () => setTerminal(getTerminalSeleccionada());
    window.addEventListener("terminal-seleccionada", actualizar);
    window.addEventListener("storage", actualizar);
    return () => {
      window.removeEventListener("terminal-seleccionada", actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, []);

  return { terminal };
}
