# ADR-UYARI-001 — Uyari no tiene lógica de IA propia

- Estado: Aceptado
- Fecha: 2026-10-14
- Autor: David Duque

## Contexto
Uyari necesita STT, LLM, memoria semántica y guía en vivo. ConPakta ya ofrece
AIRouter (proveedores IA), ConRAG (memoria/búsqueda) e Illari (copiloto).
Regla del ecosistema: no duplicar módulos existentes.

## Decisión
- STT y LLM: solo vía AIRouter.
- Memoria de proyecto y búsqueda con cita: ConRAG.
- Guía en vivo (qué preguntar / acotar / falta): Illari, con contexto que Uyari envía
  (fase, checklist, perfil, últimos 30 s de transcripción).
- Uyari solo orquesta: captura, prompts/perfiles, validación JSON, persistencia, UI.

## Consecuencias
- Cambiar de proveedor de IA no toca Uyari.
- Mejoras en Illari benefician a Uyari y al resto del ecosistema.
- Costo IA medido y facturado por AIRouter por tenant/producto.
- Dependencia: si Illari no soporta streaming de contexto, se agrega en Illari, no en Uyari.
