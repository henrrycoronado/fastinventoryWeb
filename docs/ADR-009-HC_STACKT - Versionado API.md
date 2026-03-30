# ADR-009-HC_STACKT — Versionado API y Backward Compatibility

## Status
**Status:** Proposed

## Context
InventarySystem_Web consume un REST API del backend (.NET). Conforme evolucionan ambos sistemas, el backend puede cambiar endpoints o estructuras de respuesta. Sin versionado claro, cambios en el backend rompen el frontend en producción.

## Decision
Implementaremos **versionado de API** en el cliente (prefijo `/api/v1`, `/api/v2`). El backend mantendrá compatibilidad hacia atrás o versiones paralelas. El frontend solo migra a nueva versión cuando está lista, no de forma forzada.

## Alternatives Considered
- **Sin versionado:** Cambios en backend rompen frontend inmediatamente; imposible desplegar de forma independiente.
- **Versionado solo en backend:** Frontend siempre fuerza actualización; no hay flexibilidad de despliegue.
- **GraphQL:** Mejor evolución de esquemas pero agrega complejidad innecesaria a REST.

## Consequences
**Positivas:**
- Backend y frontend pueden evolucionar independientemente
- Cambios graduales en API sin romper clientes en producción
- Facilita despliegues sin coordinación
- Backward compatibility reduce riesgos de deployment

**Negativas:**
- Requiere mantener múltiples versiones de API en backend
- Complejidad adicional en el cliente (manejar múltiples versiones)
- Deuda técnica: versiones antiguas obsoletas pero activas
- Requiere disciplina en equipo para deprecar versiones antiguas