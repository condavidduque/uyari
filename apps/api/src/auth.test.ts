import { describe, expect, it } from 'vitest';
import { ROL_ADMIN, ROL_SERVICIO, esServicioUyari, puedeUsar, usuarioDesdeClaims } from './auth.js';

describe('usuarioDesdeClaims', () => {
  it('une roles de realm y de la audiencia y normaliza el correo', () => {
    const u = usuarioDesdeClaims(
      {
        sub: 'abc',
        tenant_id: '7',
        email: 'Ana@Ejemplo.com ',
        realm_access: { roles: ['uyari-usuario'] },
        resource_access: { uyari: { roles: [ROL_ADMIN] } },
      },
      'uyari',
    );
    expect(u.tenantId).toBe(7);
    expect(u.email).toBe('ana@ejemplo.com');
    expect(u.roles.sort()).toEqual([ROL_ADMIN, 'uyari-usuario'].sort());
  });

  it('ignora roles de otra audiencia', () => {
    const u = usuarioDesdeClaims(
      { sub: 'abc', tenant_id: 1, resource_access: { otra: { roles: [ROL_ADMIN] } } },
      'uyari',
    );
    expect(u.roles).toEqual([]);
  });

  it('descarta tenant_id no entero o no positivo', () => {
    for (const t of ['0', '-3', 'abc', 1.5, null, '']) {
      expect(usuarioDesdeClaims({ sub: 'x', tenant_id: t }, 'uyari').tenantId).toBeUndefined();
    }
  });

  it('reconoce cuentas de servicio por preferred_username', () => {
    const u = usuarioDesdeClaims(
      {
        sub: 's',
        preferred_username: 'service-account-uyari',
        azp: 'uyari-worker',
        tenant_id: 2,
        resource_access: { uyari: { roles: [ROL_SERVICIO] } },
      },
      'uyari',
    );
    expect(esServicioUyari(u)).toBe(true);
    expect(puedeUsar(u)).toBe(true);
    expect(u.cliente).toBe('uyari-worker');
  });
});
