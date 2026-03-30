# ADR-001-HC_STACKT - Tecnologias

## Status
**Status:** Accepted

## Context
El proyecto InventarySystem_Web requiere una interfaz moderna, rápida y escalable para gestionar inventario, ventas y punto de venta. Se necesita una herramienta de bundling eficiente, tipado estático y un ecosistema robusto de componentes.

## Decision
Utilizaremos **React** como framework principal, **Vite** como bundler/dev server y **TypeScript** para tipado estático en toda la aplicación frontend.

## Alternatives Considered
- **Angular:** Framework opinionado con arquitectura compleja; React ofrece más flexibilidad y curva de aprendizaje menor.
- **Vanilla JavaScript:** Mayor control pero sin estructura ni herramientas; React proporciona componentes reutilizables y gestión de estado integrada.
- **React + JavaScript:** Pierde los beneficios de tipado estático que previenen errores en tiempo de compilación.

## Consequences
**Positivas:**
- Bundling ultra rápido (HMR instant feedback en desarrollo)
- Tipado estático reduce errores en tiempo de compilación
- Gran comunidad y ecosistema de librerías
- Mejor performance en carga inicial gracias a tree-shaking de Vite
- Componentes reutilizables facilitan mantenibilidad

**Negativas:**
- Requiere Node.js en el ambiente de desarrollo
- Curva de aprendizaje para desarrolladores sin experiencia en React
- Necesita configuración adicional para producción (build optimization)