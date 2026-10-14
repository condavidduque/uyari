import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

export interface Usuario {
  sub: string;
  roles: string[];
  tenantId?: number;
  esServicio: boolean;
  cliente?: string;
  email?: string;
  nombre: string;
}

export type Verificador = (token: string) => Promise<Usuario>;

export const ROL_ADMIN = 'uyari-admin';
export const ROL_GESTOR = 'uyari-gestor';
export const ROL_USUARIO = 'uyari-usuario';
export const ROL_SERVICIO = 'uyari-servicio';
export const ROL_PLATAFORMA = 'platform-admin';

export function verificadorKeycloak(issuer: string, audience: string): Verificador {
  const jwks = createRemoteJWKSet(new URL(`${issuer}/protocol/openid-connect/certs`));
  return async (token) => {
    const { payload } = await jwtVerify(token, jwks, { issuer, audience });
    return usuarioDesdeClaims(payload, audience);
  };
}

export function usuarioDesdeClaims(p: JWTPayload & Record<string, any>, audience = ''): Usuario {
  const roles = new Set<string>([
    ...(p.realm_access?.roles ?? []),
    ...(audience ? (p.resource_access?.[audience]?.roles ?? []) : []),
  ]);
  const t = p.tenant_id;
  const tenantId =
    t !== undefined && t !== null && t !== '' && Number.isSafeInteger(Number(t)) && Number(t) > 0
      ? Number(t)
      : undefined;
  const txt = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
  const email = txt(p.email)?.toLowerCase();
  return {
    sub: String(p.sub),
    roles: [...roles],
    tenantId,
    esServicio: String(p.preferred_username ?? '').startsWith('service-account-'),
    cliente: txt(p.azp),
    email,
    nombre: txt(p.name) ?? (txt(p.preferred_username) || email || String(p.sub)),
  };
}

const tiene = (u: Usuario, ...r: string[]) => r.some((x) => u.roles.includes(x));

export const esAdmin = (u: Usuario) => tiene(u, ROL_ADMIN, ROL_PLATAFORMA);
export const esGestor = (u: Usuario) => tiene(u, ROL_ADMIN, ROL_PLATAFORMA, ROL_GESTOR);
export const esServicioUyari = (u: Usuario) => u.esServicio && tiene(u, ROL_SERVICIO, ROL_PLATAFORMA);
export const puedeUsar = (u: Usuario) => tiene(u, ROL_ADMIN, ROL_GESTOR, ROL_USUARIO, ROL_PLATAFORMA) || esServicioUyari(u);
