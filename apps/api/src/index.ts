import { construirApp } from './app.js';
import { verificadorKeycloak } from './auth.js';

const issuer = process.env.IDENTITY_ISSUER ?? 'https://auth.conpakta.com/realms/conpakta';
const audience = process.env.IDENTITY_AUDIENCE ?? 'uyari';
const puerto = Number(process.env.PORT ?? 5900);

const app = construirApp({
  verificador: verificadorKeycloak(issuer, audience),
  logger: true,
});

await app.listen({ port: puerto, host: '0.0.0.0' });
