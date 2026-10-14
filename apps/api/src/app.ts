import Fastify, { type FastifyInstance, type FastifyRequest } from 'fastify';
import { puedeUsar, type Usuario, type Verificador } from './auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    usuario?: Usuario;
  }
}

export interface OpcionesApp {
  verificador: Verificador;
  logger?: boolean;
}

export function construirApp({ verificador, logger = false }: OpcionesApp): FastifyInstance {
  const app = Fastify({ logger });

  app.get('/v1/salud', async () => ({ ok: true }));

  app.addHook('preHandler', async (req: FastifyRequest, res) => {
    if (req.routeOptions.url === '/v1/salud') return;
    const cabecera = req.headers.authorization ?? '';
    const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7).trim() : '';
    if (!token) {
      return res.code(401).send({ error: 'no_autenticado' });
    }
    try {
      req.usuario = await verificador(token);
    } catch {
      return res.code(401).send({ error: 'token_invalido' });
    }
    if (!req.usuario.tenantId && !req.usuario.esServicio) {
      return res.code(403).send({ error: 'sin_tenant' });
    }
    if (!puedeUsar(req.usuario)) {
      return res.code(403).send({ error: 'sin_rol_uyari' });
    }
  });

  app.get('/v1/yo', async (req) => ({
    sub: req.usuario!.sub,
    tenant_id: req.usuario!.tenantId ?? null,
    roles: req.usuario!.roles,
  }));

  return app;
}
