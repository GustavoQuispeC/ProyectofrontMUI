// Datos de relleno (mock) para el navbar. Aún no conectado a la BD.

export interface MegaMenuGroup {
  title: string;
  seeAllHref?: string;
  items: string[];
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  href: string;
  badge?: string;
  groups: MegaMenuGroup[];
}

export const MENU_CATEGORIES: MegaMenuCategory[] = [
  {
    id: "cementos",
    label: "Cementos",
    href: "/productFilter?category=Cementos",
    badge: "OFERTA",
    groups: [
      {
        title: "Cemento Portland",
        seeAllHref: "/productFilter?category=Cementos",
        items: ["Tipo I", "Tipo IP", "Tipo GU", "Tipo MS"],
      },
      {
        title: "Cemento Especializado",
        items: ["Cemento Antisalitre", "Cemento Blanco", "Cemento de Alta Resistencia"],
      },
      {
        title: "Aditivos y Morteros",
        items: ["Mortero Predosificado", "Aditivo Impermeabilizante", "Aditivo Acelerante", "Pegamento para Cerámicos"],
      },
    ],
  },
  {
    id: "fierros",
    label: "Fierros y Aceros",
    href: "/productFilter?category=Fierros",
    groups: [
      {
        title: "Fierro Corrugado",
        seeAllHref: "/productFilter?category=Fierros",
        items: ['3/8"', '1/2"', '5/8"', '3/4"', '1"'],
      },
      {
        title: "Aceros Lisos",
        items: ["Liso 6 mm", "Liso 8 mm", "Liso 12 mm"],
      },
      {
        title: "Mallas y Estribos",
        items: ["Malla Electrosoldada", "Estribos Prefabricados", "Acero de Refuerzo"],
      },
    ],
  },
  {
    id: "ladrillos",
    label: "Ladrillos y Bloques",
    href: "/productFilter?category=Ladrillos",
    groups: [
      {
        title: "Ladrillo King Kong",
        seeAllHref: "/productFilter?category=Ladrillos",
        items: ["18 Huecos", "12 Huecos", "King Kong Sólido"],
      },
      {
        title: "Bloques y Pandereta",
        items: ["Bloque de Concreto", "Pandereta Estándar", "Ladrillo Pastelero"],
      },
      {
        title: "Ladrillo Techo",
        items: ["Ladrillo Hueco 15", "Ladrillo Hueco 12", "Viguetas Prefabricadas"],
      },
    ],
  },
  {
    id: "perfiles-tubos",
    label: "Perfiles y Tubos",
    href: "/productFilter?category=Perfiles%20y%20Tubos",
    groups: [
      {
        title: "Perfiles Metálicos",
        seeAllHref: "/productFilter?category=Perfiles%20y%20Tubos",
        items: ["Ángulo Estructural", "Perfil C", "Perfil T", "Plancha LAC"],
      },
      {
        title: "Tubos Estructurales",
        items: ["Tubo Cuadrado", "Tubo Rectangular", "Tubo Redondo"],
      },
    ],
  },
  {
    id: "tuberias",
    label: "Tuberías y Accesorios",
    href: "/productFilter?category=Tuber%C3%ADas%2C%20tanques%20y%20accesorios",
    groups: [
      {
        title: "Tuberías PVC",
        seeAllHref: "/productFilter?category=Tuber%C3%ADas%2C%20tanques%20y%20accesorios",
        items: ["Tubo PVC Agua", "Tubo PVC Desagüe", "Tubo PVC Eléctrico"],
      },
      {
        title: "Tanques y Accesorios",
        items: ["Tanque Rotoplas", "Codos y Uniones", "Llaves de Paso"],
      },
    ],
  },
  {
    id: "alambres",
    label: "Alambres y Clavos",
    href: "/productFilter?category=Alambres",
    groups: [
      {
        title: "Alambres",
        seeAllHref: "/productFilter?category=Alambres",
        items: ["Alambre Negro N°16", "Alambre Galvanizado", "Alambre de Púas"],
      },
      {
        title: "Clavos",
        items: ["Clavo 1½”", "Clavo 3”", "Clavo con Cabeza"],
      },
    ],
  },
  {
    id: "teja-calamina",
    label: "Teja y Calamina",
    href: "/productFilter?category=Teja%20Andina",
    groups: [
      {
        title: "Teja Andina",
        seeAllHref: "/productFilter?category=Teja%20Andina",
        items: ["Teja Andina 1.80m", "Teja Andina 3.00m", "Accesorios de Fijación"],
      },
      {
        title: "Calaminas",
        items: ["Calamina Galvanizada", "Calamina Traslúcida", "Calamina Acústica"],
      },
    ],
  },
  {
    id: "herramientas",
    label: "Herramientas",
    href: "/productFilter?category=Herramientas",
    groups: [
      {
        title: "Herramientas Manuales",
        seeAllHref: "/productFilter?category=Herramientas",
        items: ["Martillos", "Serruchos", "Palas y Picos", "Carretillas"],
      },
      {
        title: "Herramientas Eléctricas",
        items: ["Taladros", "Amoladoras", "Mezcladoras"],
      },
    ],
  },
  {
    id: "pinturas",
    label: "Pinturas y Acabados",
    href: "/productFilter?category=Pinturas",
    groups: [
      {
        title: "Pinturas",
        seeAllHref: "/productFilter?category=Pinturas",
        items: ["Pintura Látex", "Esmalte Sintético", "Pintura Anticorrosiva"],
      },
      {
        title: "Acabados",
        items: ["Yeso", "Masilla", "Sellador"],
      },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad y EPP",
    href: "/productFilter?category=Seguridad",
    groups: [
      {
        title: "Protección Personal",
        seeAllHref: "/productFilter?category=Seguridad",
        items: ["Cascos de Seguridad", "Guantes de Cuero", "Botas Punta de Acero"],
      },
      {
        title: "Señalización",
        items: ["Cinta de Seguridad", "Conos de Tránsito", "Extintores"],
      },
    ],
  },
];

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

export interface SearchSuggestion {
  term: string;
  categoryHint?: string;
}

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
