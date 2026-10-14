import { describe, expect, it } from 'vitest';
import { construirApp } from './app.js';
import { ROL_GESTOR, ROL_USUARIO, type Usuario } from './auth.js';

const usuario = (over: Partial<Usuario> = {}): Usuario => ({
  sub: 'u-1',
  roles: [ROL_USUARIO],
  tenantId: 1,
  esServicio: false,
  nombre: 'Ana',
  ...over,
});

const apps = (u: Usuario | Error) =>
  construirApp({
    verificador: async () => {
      if (u instanceof Error) throw u;
      return u;
    },
  });

describe('guard de Uyari', () => {
  it('deja pasar la salud sin token', async () => {
    const app = apps(usuario());
    const r = await app.inject({ method: 'GET', url: '/v1/salud' });
    expect(r.statusCode).toBe(200);
  });

  it('responde 401 sin cabecera Authorization', async () => {
    const app = apps(usuario());
    const r = await app.inject({ method: 'GET', url: '/v1/yo' });
    expect(r.statusCode).toBe(401);
    expect(r.json()).toEqual({ error: 'no_autenticado' });
  });

  it('responde 401 si el token no verifica', async () => {
    const app = apps(new Error('firma inválida'));
    const r = await app.inject({
      method: 'GET',
      url: '/v1/yo',
      headers: { authorization: 'Bearer malo' },
    });
    expect(r.statusCode).toBe(401);
    expect(r.json()).toEqual({ error: 'token_invalido' });
  });

  it('responde 403 si el token no trae tenant_id', async () => {
    const app = apps(usuario({ tenantId: undefined }));
    const r = await app.inject({
      method: 'GET',
      url: '/v1/yo',
      headers: { authorization: 'Bearer ok' },
    });
    expect(r.statusCode).toBe(403);
    expect(r.json()).toEqual({ error: 'sin_tenant' });
  });

  it('responde 403 si el usuario no tiene rol de Uyari', async () => {
    const app = apps(usuario({ roles: ['otro-rol'] }));
    const r = await app.inject({
      method: 'GET',
      url: '/v1/yo',
      headers: { authorization: 'Bearer ok' },
    });
    expect(r.statusCode).toBe(403);
    expect(r.json()).toEqual({ error: 'sin_rol_uyari' });
  });

  it('entrega el usuario y su tenant con rol válido', async () => {
    const app = apps(usuario({ roles: [ROL_GESTOR] }));
    const r = await app.inject({
      method: 'GET',
      url: '/v1/yo',
      headers: { authorization: 'Bearer ok' },
    });
    expect(r.statusCode).toBe(200);
    expect(r.json()).toEqual({ sub: 'u-1', tenant_id: 1, roles: [ROL_GESTOR] });
  });
});
