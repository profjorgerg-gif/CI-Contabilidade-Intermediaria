// ============================================================================
// Hooks de armazenamento — reaproveitados quase à risca do PPFCHH
// (useSharedList / useSharedObject), sobre a mesma API window.storage.
// ============================================================================
import { useState, useEffect, useCallback, useRef } from "react";

export function useSharedList(key) {
  const [value, setValue] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.storage.get(key, true);
        if (alive) setValue(r ? JSON.parse(r.value) : []);
      } catch {
        if (alive) setValue([]);
      }
    })();
    return () => { alive = false; };
  }, [key]);

  const save = useCallback(async (next) => {
    setValue(next);
    try { await window.storage.set(key, JSON.stringify(next), true); } catch {}
  }, [key]);

  return [value, save];
}

export function useSharedObject(key, fallback) {
  const [value, setValue] = useState(undefined);
  const ultimaEdicaoLocalRef = useRef(0);
  const ultimoEscritoRef = useRef(null);

  useEffect(() => {
    if (!key) { setValue(undefined); return; }
    let alive = true;

    const carregar = async (viaSincronizacao) => {
      try {
        const r = await window.storage.get(key, true);
        if (!alive) return;
        const carregado = r ? JSON.parse(r.value) : fallback;
        if (!viaSincronizacao) {
          setValue(carregado);
          ultimoEscritoRef.current = JSON.stringify(carregado);
          return;
        }
        const textoCarregado = JSON.stringify(carregado);
        const inativoOk = Date.now() - ultimaEdicaoLocalRef.current > 4000;
        if (inativoOk && textoCarregado !== ultimoEscritoRef.current) {
          ultimoEscritoRef.current = textoCarregado;
          setValue(carregado);
        }
      } catch {
        if (alive && !viaSincronizacao) setValue(fallback);
      }
    };

    carregar(false);
    const intervalId = setInterval(() => carregar(true), 8000);
    const aoFocar = () => carregar(true);
    window.addEventListener("focus", aoFocar);
    document.addEventListener("visibilitychange", aoFocar);
    return () => {
      alive = false;
      clearInterval(intervalId);
      window.removeEventListener("focus", aoFocar);
      document.removeEventListener("visibilitychange", aoFocar);
    };
  }, [key]);

  const save = useCallback(async (next) => {
    ultimaEdicaoLocalRef.current = Date.now();
    setValue(next);
    const json = JSON.stringify(next);
    ultimoEscritoRef.current = json;
    try { await window.storage.set(key, json, true); } catch {}
  }, [key]);

  return [value, save];
}
