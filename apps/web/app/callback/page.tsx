'use client';

import { useEffect, useState } from 'react';
import { canjearCodigo } from '../../lib/sesion';

export default function Callback() {
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codigo = params.get('code');
    if (!codigo) return setError('falta_codigo');
    canjearCodigo(codigo)
      .then(() => location.replace('/'))
      .catch((e: Error) => setError(e.message));
  }, []);

  return error ? <p role="alert">Error al entrar: {error}</p> : <p>Entrando…</p>;
}
