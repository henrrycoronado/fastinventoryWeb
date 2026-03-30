# ADR-002-HC_STACKT — Arquitectura Feature-Based y Módulos

## Status
**Status:** Accepted

## Context
A medida que crece InventarySystem_Web, necesitamos una estructura de carpetas que facilite el escalamiento, mantenimiento y colaboración entre desarrolladores. La organización del código debe permitir agregar nuevas features sin afectar las existentes.

## Decision
Organizaremos el proyecto mediante **arquitectura Feature-Based**, donde cada feature (autenticación, inventario, ventas, PDV) es un módulo independiente con su propia estructura de componentes, hooks, servicios y estilos.

## Alternatives Considered
- **Arquitectura Layer-Based:** Carpetas por tipo (components/, services/, hooks/). Escalabilidad pobre; dificulta ubicar código relacionado cuando el proyecto crece.
- **Arquitectura Monolítica:** Todo en carpetas planas. Genera conflictos de nombres y dificulta el mantenimiento.

## Consequences
**Positivas:**
- Código modular y reutilizable
- Fácil de escalar: agregar nueva feature no afecta las existentes
- Mejor separación de responsabilidades
- Facilita trabajo en paralelo de múltiples desarrolladores
- Más fácil de testear features independientemente

**Negativas:**
- Requiere disciplina en el equipo para mantener la estructura
- Posible duplicación de código si no se centralizan utilities compartidas
- Carpetas nested pueden volverse complejas si no se organizan bien