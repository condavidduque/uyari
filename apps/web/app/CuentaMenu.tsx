'use client';

// Menú de cuenta compartido (Mi perfil, Mi empresa, Fondo, Cerrar sesión). Lo sirve Caddy en /cuenta/menu.js (mismo origen).
// Si no carga, la aplicación sigue funcionando y queda un botón «Cerrar sesión».
import { useEffect, useRef, useState } from 'react';
import { cerrarSesion, tokenGuardado } from '../lib/sesion';

const URL_MENU = '/cuenta/menu.js';
const URL_CSS = '/cuenta/menu.css';

interface ModuloMenu {
  montarMenuCuenta: (
    raiz: HTMLElement,
    o: { producto: string; nombreProducto: string; token: () => Promise<string>; rol?: string; cerrarSesion: () => void },
  ) => Promise<unknown>;
}

export function CuentaMenu() {
  const raiz = useRef<HTMLDivElement>(null);
  const iniciado = useRef(false);
  const [fallo, setFallo] = useState(false);
  const [hayToken, setHayToken] = useState(false);

  useEffect(() => setHayToken(tokenGuardado() !== null), []);

  useEffect(() => {
    if (!hayToken || iniciado.current || !raiz.current) return;
    iniciado.current = true;
    if (!document.querySelector(`link[href="${URL_CSS}"]`)) {
      const enlace = document.createElement('link');
      enlace.rel = 'stylesheet';
      enlace.href = URL_CSS;
      document.head.appendChild(enlace);
    }
    import(/* webpackIgnore: true */ URL_MENU)
      .then((m: ModuloMenu) =>
        m.montarMenuCuenta(raiz.current as HTMLElement, {
          producto: 'uyari',
          nombreProducto: 'Uyari',
          token: async () => tokenGuardado() ?? '',
          cerrarSesion,
        }),
      )
      .catch(() => setFallo(true));
  }, [hayToken]);

  if (!hayToken) return null;
  return (
    <div ref={raiz}>
      {fallo && (
        <button type="button" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      )}
    </div>
  );
}
