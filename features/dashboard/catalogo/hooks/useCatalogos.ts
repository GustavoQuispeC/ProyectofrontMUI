import { useState, useEffect } from "react";
import {
  listarEstadosCiviles,
  listarGeneros,
  listarMotivosEgreso,
  listarNivelesEducativos,
  listarSistemasPensiones,
  listarTiposContrato,
  listarTiposDocumento,
  listarTiposDocumentoCompra,
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
  sistemasPensiones: CatalogoItem[];
  nivelesEducativos: CatalogoItem[];
  tiposParentesco: CatalogoItem[];
  tiposContrato: CatalogoItem[];
  tiposJornada: CatalogoItem[];
  motivosEgreso: CatalogoItem[];
  tiposDocumentoCompra: CatalogoItem[];
}

const initialCatalogos: Catalogos = {
  tiposDocumentos: [],
  generos: [],
  estadosCiviles: [],
  sistemasPensiones: [],
  nivelesEducativos: [],
  tiposParentesco: [],
  tiposContrato: [],
  tiposJornada: [],
  motivosEgreso: [],
  tiposDocumentoCompra: [],
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
          sistemasPensiones,
          nivelesEducativos,
          tiposParentesco,
          tiposContrato,
          tiposJornada,
          motivosEgreso,
          tiposDocumentoCompra,
        ] = await Promise.all([
          listarTiposDocumento(),
          listarGeneros(),
          listarEstadosCiviles(),
          listarSistemasPensiones(),
          listarNivelesEducativos(),
          listarTiposParentesco(),
          listarTiposContrato(),
          listarTiposJornada(),
          listarMotivosEgreso(),
          listarTiposDocumentoCompra(),
        ]);

        setCatalogos({
          tiposDocumentos: tiposDocumentos ?? [],
          generos: generos ?? [],
          estadosCiviles: estadosCiviles ?? [],
          sistemasPensiones: sistemasPensiones ?? [],
          nivelesEducativos: nivelesEducativos ?? [],
          tiposParentesco: tiposParentesco ?? [],
          tiposContrato: tiposContrato ?? [],
          tiposJornada: tiposJornada ?? [],
          motivosEgreso: motivosEgreso ?? [],
          tiposDocumentoCompra: tiposDocumentoCompra ?? [],
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
