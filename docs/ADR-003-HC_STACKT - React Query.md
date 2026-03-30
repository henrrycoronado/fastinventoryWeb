# ADR-003-HC_STACKT — React Query para Sincronización Backend↔Frontend

## Status
**Status:** Accepted

## Context
InventarySystem_Web necesita sincronizar datos con el backend constantemente (inventario, ventas, órdenes, etc.). Manejar estados, caché, refetch y sincronización manualmente es propenso a errores y complica el código.

## Decision
Utilizaremos **React Query** (TanStack Query) para gestionar el estado del servidor, caché automático, refetch inteligente y sincronización bidireccional con el backend REST API.

## Alternatives Considered
- **Redux + Thunk:** Mayor boilerplate y configuración manual; React Query maneja caché y sincronización automáticamente.
- **SWR (stale-while-revalidate):** Más ligero pero menos features; React Query ofrece más control sobre caché, refetch y mutations.
- **Zustand puro:** Manejo manual de sincronización con servidor; no escala bien para datos complejos del backend.

## Consequences
**Positivas:**
- Caché automático y sincronización transparente
- Refetch inteligente (background refetch, stale data)
- Mejor rendimiento: evita requests innecesarias
- Devtools integrado para debugging
- Mutations con optimistic updates

**Negativas:**
- Dependencia adicional (aumenta bundle)
- Curva de aprendizaje: requiere entender conceptos de caché y stale data
- Puede ser overkill para features simples sin backend