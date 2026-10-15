'use client';

import { useEffect, useState } from 'react';
import { API, cerrarSesion, iniciarLogin, tokenGuardado } from '../lib/sesion';

type Yo = { sub: string; tenant_id: number | null; roles: string[] };

export default function Inicio() {
  const [estado, setEstado] = useState<'cargando' | 'sin_sesion' | 'listo' | 'error'>('cargando');
  const [yo, setYo] = useState<Yo | null>(null);
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    const token = tokenGuardado();
    if (!token) return setEstado('sin_sesion');
    fetch(`${API}/v1/yo`, { headers: { authorization: `Bearer ${token}` } })
      .then(async (r) => {
        if (r.status === 401) return setEstado('sin_sesion');
        if (!r.ok) {
          setDetalle((await r.json()).error ?? `http_${r.status}`);
          return setEstado('error');
        }
        setYo((await r.json()) as Yo);
        setEstado('listo');
      })
      .catch(() => {
        setDetalle('api_no_disponible');
        setEstado('error');
      });
  }, []);

  if (estado === 'cargando') return <p>Cargando…</p>;
  if (estado === 'sin_sesion')
    return (
      <main>
        <h1>Uyari</h1>
        <button onClick={() => iniciarLogin()}>Entrar con ConPakta</button>
      </main>
    );
  if (estado === 'error')
    return (
      <main>
        <h1>Uyari</h1>
        <p role="alert">No se pudo cargar tu sesión: {detalle}</p>
        <button onClick={cerrarSesion}>Salir</button>
      </main>
    );
  return (
    <main>
      <h1>Uyari</h1>
      <p>Tenant: {yo?.tenant_id ?? 'sin tenant'}</p>
      <p>Roles: {yo?.roles.join(', ')}</p>
      <button onClick={cerrarSesion}>Salir</button>
    </main>
  );
}
