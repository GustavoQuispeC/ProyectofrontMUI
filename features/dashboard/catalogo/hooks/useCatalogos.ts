import { useState, useEffect } from "react";
import {
  listarEstadosCiviles,
  listarGeneros,
  listarNivelesEducativos,
  listarSistemasPensiones,
  listarTiposContrato,
  listarTiposCuentaBancaria,
  listarTiposDocumento,
  listarTiposJornada,
  listarTiposParentesco,
} from "../catalogo.service";

interface CatalogoItem {
  id: number;
  nombre: string;
}

interface Catalogos {
  tiposDocumentos: CatalogoItem[];
  generos: CatalogoItem[];
  estadosCiviles: CatalogoItem[];
  tiposCuentaBancaria: CatalogoItem[];
  sistemasPensiones: CatalogoItem[];
  nivelesEducativos: CatalogoItem[];
  tiposParentesco: CatalogoItem[];
  tiposContrato: CatalogoItem[];
  tiposJornada: CatalogoItem[];
}

const initialCatalogos: Catalogos = {
  tiposDocumentos: [],
  generos: [],
  estadosCiviles: [],
  tiposCuentaBancaria: [],
  sistemasPensiones: [],
  nivelesEducativos: [],
  tiposParentesco: [],
  tiposContrato: [],
  tiposJornada: [],
};

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState<Catalogos>(initialCatalogos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          tiposDocumentos,
          generos,
          estadosCiviles,
          tiposCuentaBancaria,
          sistemasPensiones,
          nivelesEducativos,
          tiposParentesco,
          tiposContrato,
          tiposJornada,
        ] = await Promise.all([
          listarTiposDocumento(),
          listarGeneros(),
          listarEstadosCiviles(),
          listarTiposCuentaBancaria(),
          listarSistemasPensiones(),
          listarNivelesEducativos(),
          listarTiposParentesco(),
          listarTiposContrato(),
          listarTiposJornada(),
        ]);

        setCatalogos({
          tiposDocumentos: tiposDocumentos ?? [],
          generos: generos ?? [],
          estadosCiviles: estadosCiviles ?? [],
          tiposCuentaBancaria: tiposCuentaBancaria ?? [],
          sistemasPensiones: sistemasPensiones ?? [],
          nivelesEducativos: nivelesEducativos ?? [],
          tiposParentesco: tiposParentesco ?? [],
          tiposContrato: tiposContrato ?? [],
          tiposJornada: tiposJornada ?? [],
        });
      } catch (err) {
        console.error("Error en la carga masiva de catálogos:", err);
        setError("Error al cargar los catálogos");
      } finally {
        setLoading(false);
      }
    };

    cargarCatalogos();
  }, []);

  return { catalogos, loading, error };
}
