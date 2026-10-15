const ISSUER = process.env.NEXT_PUBLIC_IDENTITY_ISSUER ?? 'https://auth.conpakta.com/realms/conpakta';
const CLIENTE = 'uyari';
const CLAVE_VERIFICADOR = 'uyari.pkce';
const CLAVE_TOKEN = 'uyari.token';

export const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5900';

const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export async function iniciarLogin(): Promise<void> {
  const verificador = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const desafio = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verificador))));
  sessionStorage.setItem(CLAVE_VERIFICADOR, verificador);
  const params = new URLSearchParams({
    client_id: CLIENTE,
    response_type: 'code',
    scope: 'openid',
    redirect_uri: `${location.origin}/callback`,
    code_challenge: desafio,
    code_challenge_method: 'S256',
  });
  location.assign(`${ISSUER}/protocol/openid-connect/auth?${params}`);
}

export async function canjearCodigo(codigo: string): Promise<void> {
  const verificador = sessionStorage.getItem(CLAVE_VERIFICADOR);
  sessionStorage.removeItem(CLAVE_VERIFICADOR);
  if (!verificador) throw new Error('sesion_expirada');
  const r = await fetch(`${ISSUER}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENTE,
      code: codigo,
      redirect_uri: `${location.origin}/callback`,
      code_verifier: verificador,
    }),
  });
  if (!r.ok) throw new Error('canje_fallido');
  const { access_token } = (await r.json()) as { access_token: string };
  sessionStorage.setItem(CLAVE_TOKEN, access_token);
}

export const tokenGuardado = (): string | null =>
  typeof window === 'undefined' ? null : sessionStorage.getItem(CLAVE_TOKEN);

export function cerrarSesion(): void {
  sessionStorage.removeItem(CLAVE_TOKEN);
  location.assign('/');
}
