'use client';

import { useEffect, useState } from 'react';
import { canjearCodigo, iniciarLogin } from '../../lib/sesion';

export default function Callback() {
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codigo = params.get('code');
    // Un inicio de sesión silencioso (cambio de empresa) que Keycloak no puede hacer sin pantalla: se pasa al inicio de sesión normal.
    if (!codigo && ['login_required', 'interaction_required'].includes(params.get('error') ?? '')) { void iniciarLogin(); return; }
    if (!codigo) return setError('falta_codigo');
    canjearCodigo(codigo)
      .then(() => location.replace('/'))
      .catch((e: Error) => setError(e.message));
  }, []);

  return error ? <p role="alert">Error al entrar: {error}</p> : <p>Entrando…</p>;
}
