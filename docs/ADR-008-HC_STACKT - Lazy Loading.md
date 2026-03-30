# ADR-008-HC_STACKT — Lazy Loading de Módulos

## Status
**Status:** Accepted

## Context
InventarySystem_Web agrupa features en módulos (inventario, ventas, PDV, autenticación). Si todos los módulos se cargan inicialmente, el bundle principal crece excesivamente, ralentizando la carga inicial de la app.

## Decision
Implementaremos **code splitting y lazy loading** de módulos usando React.lazy() y Suspense. Cada feature-module se cargará dinámicamente cuando el usuario lo necesite, no en la carga inicial.

## Alternatives Considered
- **Bundle monolítico:** Cargar todo al inicio; bundle grande, mala performance en conexiones lentas.
- **Manual chunk splitting:** Más control pero requiere más configuración; Vite maneja automáticamente.
- **Webpack Magic Comments:** Alternativa manual; Vite es más sencillo y automático.

## Consequences
**Positivas:**
- Bundle inicial más pequeño (mejor First Contentful Paint)
- Usuarios solo descargan código que usan
- Mejor performance en dispositivos/conexiones lentas
- Escalabilidad: agregar features no afecta bundle inicial
- Mejor UX: app carga rápido

**Negativas:**
- Overhead al cambiar entre módulos (pequeño delay de carga)
- Requiere Suspense fallback en UI
- Debugging más complejo (código split entre archivos)
- Posible duplicación de código entre chunks