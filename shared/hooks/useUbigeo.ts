import { useState, useEffect } from "react";

export function useUbigeo() {
  const [ubigeoData, setUbigeoData] = useState<any>(null);
  const [loadingUbigeo, setLoadingUbigeo] = useState(true);

  useEffect(() => {
    fetch("https://free.e-api.net.pe/ubigeos.json")
      .then((res) => res.json())
      .then((json) => {
        setUbigeoData(json);
        setLoadingUbigeo(false);
      })
      .catch(() => setLoadingUbigeo(false));
  }, []);

  return { ubigeoData, loadingUbigeo };
}
