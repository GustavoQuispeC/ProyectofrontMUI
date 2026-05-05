import { useState, useEffect, useMemo } from "react";

export interface Ubigeo {
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;
}

function flattenUbigeo(json: Record<string, Record<string, Record<string, { ubigeo?: string }>>>): Ubigeo[] {
  const result: Ubigeo[] = [];

  for (const depNombre of Object.keys(json)) {
    const provincias = json[depNombre];
    for (const provNombre of Object.keys(provincias)) {
      const distritos = provincias[provNombre];
      for (const distNombre of Object.keys(distritos)) {
        const { ubigeo } = distritos[distNombre];
        result.push({
          departamento: depNombre,
          provincia: provNombre,
          distrito: distNombre,
          ubigeo: ubigeo ?? "",
        });
      }
    }
  }

  return result;
}

export function useUbigeo() {
  const [ubigeoData, setUbigeoData] = useState<Ubigeo[]>([]);
  const [loadingUbigeo, setLoadingUbigeo] = useState(true);

  useEffect(() => {
    fetch("https://free.e-api.net.pe/ubigeos.json")
      .then((res) => res.json())
      .then((json) => {
        setUbigeoData(flattenUbigeo(json));
        setLoadingUbigeo(false);
      })
      .catch(() => setLoadingUbigeo(false));
  }, []);

  const departamentos = useMemo(() => [...new Set(ubigeoData.map((u) => u.departamento))].sort(), [ubigeoData]);

  function getProvincias(departamento: string): string[] {
    return [...new Set(ubigeoData.filter((u) => u.departamento === departamento).map((u) => u.provincia))].sort();
  }

  function getDistritos(departamento: string, provincia: string): string[] {
    return ubigeoData
      .filter((u) => u.departamento === departamento && u.provincia === provincia)
      .map((u) => u.distrito)
      .sort();
  }

  return { ubigeoData, loadingUbigeo, departamentos, getProvincias, getDistritos };
}
