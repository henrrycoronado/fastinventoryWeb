# ADR-004-HC_STACKT — Tailwind CSS + Componentes Base

## Status
**Status:** Accepted

## Context
InventarySystem_Web requiere estilos consistentes, rápidos de desarrollar y fáciles de mantener. Los componentes deben ser reutilizables (botones, inputs, modales, tablas) y tener un diseño coherente en toda la aplicación.

## Decision
Utilizaremos **Tailwind CSS** para estilos utility-first combinado con una librería de **componentes base** (propios o headless UI como Radix UI/Headless UI) que estandaricen botones, inputs, modales y otros elementos comunes.

## Alternatives Considered
- **CSS Modules + SASS:** Mayor control fino pero más verboso; Tailwind es más rápido de desarrollar.
- **Styled-components:** Solución CSS-in-JS; añade bundle y complejidad innecesaria comparado con Tailwind.
- **Bootstrap:** Framework preconstruido pero menos flexible; Tailwind permite customización total.

## Consequences
**Positivas:**
- Desarrollo rápido de UI (no escribir CSS custom)
- Consistencia visual en toda la app
- Bundle pequeño (Tailwind purga CSS no usado)
- Componentes reutilizables aceleran desarrollo
- Fácil mantener tema (colores, espaciado centralizado)

**Negativas:**
- Clases HTML largas y difíciles de leer inicialmente
- Requiere que todo el equipo conozca Tailwind
- Personalización profunda requiere extender configuración