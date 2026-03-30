# ADR-006-HC_STACKT — Autenticación JWT (sessionStorage)

## Status
**Status:** Proposed

## Context
InventarySystem_Web requiere autenticar usuarios contra el backend (.NET). Los tokens JWT permiten autenticación stateless. Se necesita decidir dónde almacenar el token (localStorage, sessionStorage, cookies) de forma segura.

## Decision
Almacenaremos el **JWT en sessionStorage** del navegador. El token se envía en el header `Authorization: Bearer <token>` en cada petición HTTP. Al cerrar la sesión del navegador, el token se elimina automáticamente.

## Alternatives Considered
- **localStorage:** Persiste después de cerrar navegador; vulnerable a XSS (ataques de script inyectado).
- **Cookies HttpOnly:** Más seguro contra XSS pero requiere configuración CORS/SameSite en backend.
- **Memory (variable en JS):** Se pierde al refrescar la página; no es práctico para UX.

## Consequences
**Positivas:**
- Token se limpia automáticamente al cerrar navegador (seguridad)
- Fácil de implementar con Axios interceptor
- Accesible desde JavaScript para debugging
- Suficiente para SPA sin sensibilidad extrema

**Negativas:**
- Se pierde token al refrescar página (UX pobre si no hay refresh token)
- Vulnerable a XSS si hay scripts maliciosos inyectados
- sessionStorage no persiste entre pestañas diferentes
- Requiere refresh token en backend para mantener sesión