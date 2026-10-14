# Uyari — TASKS.md

## Sprint 1 (semanas 1–2): Captura
- [x] Crear repo `uyari` (monorepo: apps/api, apps/web, workers/ingest, workers/extract, workers/live-guide, packages/schemas)
- [x] docker compose dev: postgres, redis, api, web
- [~] Registrar `uyari` como producto/unidad de negocio en ConPakta (migraciones escritas: activacion-0029_uyari.sql y tenant-registry-0019_unidad_uyari.sql; falta aplicarlas en prod y el PR en conenlace-platform)
- [ ] Reservar puertos 5900–5909 en el mapa global
- [ ] Subdominio `uyari.conpakta.com` + TLS
- [~] Login con ConPakta Identity (JWT/JWKS), guard por tenant (módulo `apps/api/src/auth.ts` escrito; falta registrar el middleware en Fastify, el cliente Keycloak y las pruebas)
- [ ] Migraciones: project, phase, profile, meeting, segment (RLS por tenant)
- [ ] PWA: botón grabar/pausar/finalizar, indicador de nivel de audio
- [ ] Pantalla de consentimiento al iniciar; guardar aceptación por participante
- [ ] WebSocket de audio → ingest (chunks 1 s, opus)
- [ ] Subida del audio completo a Waka al finalizar
- [ ] STT streaming vía AIRouter con diarización → tabla segment
- [ ] Registro de consumo IA por meeting (créditos)
- [ ] Vista de transcripción con hablantes y timestamps

## Sprint 2 (semanas 3–4): Post-reunión
- [ ] JSON Schema de extracción (packages/schemas)
- [ ] Worker extract: resumen, puntos clave, decisiones, entregables, tareas, preguntas abiertas, riesgos
- [ ] Validación de cita + timestamp; rechazo de ítems sin cita
- [ ] UI de revisión: aprobar / editar / descartar cada ítem
- [ ] Envío de resumen por Kipu (WhatsApp/correo)

## Sprint 3 (semanas 5–6): Proyectos y perfiles
- [ ] CRUD proyectos + fases + checklist
- [ ] Plantilla "Implementación IA privada" (piloto Pintulac)
- [ ] CRUD perfiles/skills por tenant
- [ ] Sync de tareas aprobadas a Kusi + calendario
- [ ] Indexar reuniones del proyecto en ConRAG

## Sprint 4 (semanas 7–8): Guía en vivo
- [ ] Worker live-guide: ventana de 30 s → Illari con fase + checklist + perfil
- [ ] Panel: Pregunta ahora / Acota / Falta / % fase
- [ ] Marcado automático de checklist_hit con evidencia
- [ ] Medir latencia (objetivo < 4 s)

## Backlog (fase 2)
- [ ] Bot para Meet/Teams/Zoom
- [ ] Brief pre-reunión por WhatsApp
- [ ] Radar de compromisos
- [ ] Detector de alcance
- [ ] Modo on-prem (STT y LLM locales)
- [ ] Coach post-reunión
