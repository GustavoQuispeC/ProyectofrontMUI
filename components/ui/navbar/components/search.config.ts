export interface SearchSuggestion {
  term: string;
  categoryHint?: string;
}

export const RELATED_BRANDS = [
  "ACEROS AREQUIPA",
  "PACASMAYO",
  "ETERNIT",
  "SIDERPERU",
  "LARK",
  "NICOLL",
  "FIBRAFORTE",
  "UYUSTOOLS",
  "ANYPSA",
  "SIKA",
  "CPP",
  "PRODAC",
];

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { term: "cemento portland tipo i", categoryHint: "Cementos" },
  { term: "cemento antisalitre", categoryHint: "Cementos" },
  { term: "fierro corrugado 1/2", categoryHint: "Fierros y Aceros" },
  { term: "fierro corrugado 3/8", categoryHint: "Fierros y Aceros" },
  { term: "malla electrosoldada", categoryHint: "Fierros y Aceros" },
  { term: "ladrillo king kong 18 huecos", categoryHint: "Ladrillos y Bloques" },
  { term: "bloque de concreto", categoryHint: "Ladrillos y Bloques" },
  { term: "tubo pvc agua 4 pulgadas", categoryHint: "Tuberías y Accesorios" },
  { term: "tubo pvc desagüe", categoryHint: "Tuberías y Accesorios" },
  { term: "alambre negro n16", categoryHint: "Alambres y Clavos" },
  { term: "clavos de 3 pulgadas", categoryHint: "Alambres y Clavos" },
  { term: "calamina galvanizada", categoryHint: "Teja y Calamina" },
  { term: "teja andina 1.80m", categoryHint: "Teja y Calamina" },
  { term: "casco de seguridad", categoryHint: "Seguridad y EPP" },
  { term: "guantes de cuero", categoryHint: "Seguridad y EPP" },
  { term: "pintura latex blanco", categoryHint: "Pinturas y Acabados" },
  { term: "taladro percutor", categoryHint: "Herramientas" },
  { term: "carretilla bugui", categoryHint: "Herramientas" },
  { term: "angulo estructural", categoryHint: "Perfiles y Tubos" },
  { term: "plancha lac", categoryHint: "Perfiles y Tubos" },
];

export function getSearchSuggestions(query: string): SearchSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];
  return SEARCH_SUGGESTIONS.filter((s) => s.term.includes(trimmed)).slice(0, 10);
}
