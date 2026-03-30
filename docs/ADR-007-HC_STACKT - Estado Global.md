# ADR-007-HC_STACKT — Estado Global Mínimo (Context API / Zustand)

## Status
**Status:** Accepted

## Context
InventarySystem_Web necesita compartir estado global (usuario autenticado, empresa actual, preferencias de UI). Sin gestión de estado global, habría prop drilling excesivo. Se requiere decidir entre Context API y Zustand.

## Decision
Utilizaremos **estado global mínimo**: solo para datos que realmente requieran estar globales (usuario, company_id, tema). Usaremos **Context API** para casos simples o **Zustand** si la complejidad crece. React Query maneja el resto del estado del servidor.

## Alternatives Considered
- **Redux:** Overkill para nuestras necesidades; añade boilerplate excesivo para estado simple.
- **Prop Drilling puro:** Sin estado global; genera código redundante y difícil de mantener.
- **MobX:** Más complejo que Zustand; Zustand es más ligero y minimalista.

## Consequences
**Positivas:**
- Evita boilerplate de Redux
- Fácil agregar estado global sin complejidad
- Context API es parte de React (sin dependencias)
- Zustand es ligero (pequeño bundle)
- Separa responsabilidades: React Query para servidor, estado global para UI

**Negativas:**
- Context API puede causar re-renders innecesarios en componentes grandes
- Zustand requiere disciplina para no abusar
- Difícil debuggear si se mezcla con React Query