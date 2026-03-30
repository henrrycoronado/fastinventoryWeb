# ADR-005-HC_STACKT — API Client Centralizado (Axios)

## Status
**Status:** Accepted

## Context
InventarySystem_Web realiza múltiples peticiones HTTP al backend (.NET). Sin un cliente centralizado, el código se duplicaría (headers, autenticación, manejo de errores) en varios lugares y sería difícil mantener.

## Decision
Crearemos un **cliente Axios centralizado** que maneje autenticación (JWT), headers comunes, interceptores para errores y rutas base del API. Todos los servicios usarán este cliente.

## Alternatives Considered
- **Fetch nativo:** Menos features que Axios; requeriría más código boilerplate para interceptores y configuración.
- **GraphQL (Apollo Client):** Overkill para un REST API; añade complejidad sin beneficio directo.

## Consequences
**Positivas:**
- Autenticación centralizada (JWT en headers automáticamente)
- Interceptores globales para manejo de errores
- Rutas base consistentes
- Fácil agregar features globales (logging, retry logic)
- Reduce duplicación de código

**Negativas:**
- Punto único de fallo: errores aquí afectan toda la app
- Requiere testing exhaustivo del cliente
- Cambios al cliente impactan toda la aplicación