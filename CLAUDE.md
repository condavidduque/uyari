# Uyari — CLAUDE.md

Uyari (kichwa: escuchar) = asistente de reuniones de ConPakta.
Graba, transcribe, guía en vivo por fase de proyecto, extrae resumen, entregables y tareas.
Producto de CONENLACE (unidad de negocio). Hereda lineamientos de `/home/CLAUDE.md`.

## Dominio y puertos
- URL: `uyari.conpakta.com`
- Puertos reservados: 5900–5909
  - 5900 api (gateway Uyari)
  - 5901 ingest (WebSocket audio + STT streaming)
  - 5902 extract (worker post-reunión)
  - 5903 live-guide (worker guía en vivo → Illari)
  - 5904 web (frontend)
  - 5905–5909 libres

## Patrones obligatorios (no negociables)
- SSO solo vía ConPakta Identity (RS256 JWT/JWKS). Nada de auth propia.
- Personas vía People Registry / Kiki antes de cualquier formulario con ID.
- Toda IA vía AIRouter (STT y LLM). Prohibido llamar proveedores directo.
- Guía en vivo usa Illari. Uyari no implementa copiloto propio.
- Memoria de proyecto y búsqueda semántica vía ConRAG.
- Audio y archivos en Waka (ConDrive).
- Notificaciones (WhatsApp, correo) vía Kipu (ConMessage).
- Tareas, deals y stakeholders se sincronizan con Kusi (ConCRM).
- Actas firmables vía DocuGo.
- Consumo IA en créditos por tenant y producto; cobro vía Sami (PayGo).
- No duplicar módulos existentes del ecosistema.

## Stack
- Backend: Node.js (TypeScript) + Fastify, workers con BullMQ sobre Redis.
- DB: PostgreSQL, `tenant_id` en todas las tablas + RLS.
- Frontend: Next.js PWA (web + móvil). Captura con MediaRecorder / WebSocket.
- Eventos: publicar `uyari.meeting.*` en el bus del ecosistema.
- Contenedores OCI, docker compose en dev; Kubernetes como objetivo.

## Entidades
project, phase, profile, meeting, segment, deliverable, action_item, checklist_hit.
Ver spec "Uyari — Spec v0.1" (Claude Docs).

## Reglas de IA
- Toda extracción devuelve JSON validado con JSON Schema antes de guardar.
- Todo deliverable/action_item lleva `quote` + `t` (segundo). Sin cita = no se guarda.
- Tareas y entregables nacen en estado `draft`; el usuario aprueba antes de sincronizar.
- Fechas relativas se normalizan contra `meeting.started_at` en zona del tenant.

## Legal
- Consentimiento de grabación registrado por participante (LOPDP Ecuador).
- Retención audio: 90 días por defecto, configurable por tenant.
- Datos aislados por tenant; cifrado en reposo.

## Comandos
- `docker compose up -d` — levanta stack dev
- `npm run dev` — api + workers en watch
- `npm test` — tests
