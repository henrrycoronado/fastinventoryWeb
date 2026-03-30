# Inevnatrio Business - Backend
stackTecnologico/
├── ADR-001_STACKTECH — PostgreSQL Multi-Tenant para SaaS
├── ADR-002_STACKTECH — Infraestructura: App + DB Gestionada + Storage + CDN
├── ADR-003_STACKTECH — Arquitectura Monolito Modular
├── ADR-004_STACKTECH — Estructura de Carpetas: Domain-Driven + Feature-Based
├── ADR-005_STACKTECH — Stack: .NET REST API + React SPA + JWT/OAuth
├── ADR-006_STACKTECH — Manejo de Imágenes: Object Storage + CDN + Presigned URLs
├── ADR-007_STACKTECH — Soft Delete Pattern (IsActive) para Auditoría
├── ADR-008_STACKTECH — Inyección de Dependencias en Constructores
└── ADR-009_STACKTECH — Multi-Tenancy por company_id (Aislamiento de Datos)

inventario/
├── ADR-010_INVENTARIO — Stock Model: Reserve→Confirm Pattern
├── ADR-011_INVENTARIO — Kardex Automático (Historial Trazable de Movimientos)
├── ADR-012_INVENTARIO — Movement Types (Entrada/Salida/Ajuste/Transfer)
├── ADR-013_INVENTARIO — Multi-Warehouse Stock Distribution
├── ADR-014_INVENTARIO — Importación de Productos desde Excel (eliminar)
├── ADR-015_INVENTARIO — Conteo Físico y Reconciliación de Stock
└── ADR-016_INVENTARIO — Unidades de Medida y Conversiones

pdv/
├── ADR-017_PDV — Arquitectura de Órdenes: Open → Billed
├── ADR-018_PDV — Estados de Items para KDS (Sent→Ready→Served)
├── ADR-019_PDV — Menu-MenuItem-Station Routing
├── ADR-020_PDV — Integración Automática PdV→Sales en Checkout
├── ADR-021_PDV — Kitchen Display System (KDS) Real-Time Updates
├── ADR-022_PDV — Métodos de Pago (Simulados)
└── ADR-023_PDV — Cálculos de Totales (Subtotal + Impuesto + Total)

ventas/
├── ADR-024_VENTAS — Flujo de Venta: DRAFT → CONFIRMED
├── ADR-025_VENTAS — Generación de Recibos (Receipt)
├── ADR-026_VENTAS — Integración Bidireccional Ventas↔Inventario
├── ADR-027_VENTAS — Historial Filtrable de Ventas
├── ADR-028_VENTAS — Edición de Ventas en DRAFT
├── ADR-029_VENTAS — Validación de Stock Pre-Venta
└── ADR-030_VENTAS — Cálculos Financieros (Subtotal/Impuesto/Total/Descuentos)




# InventarySystem_Web - Frontend
doc/stackTecnologico/
├── ADR-001_FRONTEND_STACKTECH — React + Vite + TypeScript
├── ADR-002_FRONTEND_STACKTECH — Arquitectura Feature-Based y Módulos
├── ADR-003_FRONTEND_STACKTECH — React Query para Sincronización Backend↔Frontend
├── ADR-004_FRONTEND_STACKTECH — Tailwind CSS + Componentes Base
├── ADR-005_FRONTEND_STACKTECH — API Client Centralizado (Axios)
├── ADR-006_FRONTEND_STACKTECH — Autenticación JWT (sessionStorage)
├── ADR-007_FRONTEND_STACKTECH — Estado Global Mínimo (Context API / Zustand)
├── ADR-008_FRONTEND_STACKTECH — Integración REST: Contratos y DTOs
├── ADR-009_FRONTEND_STACKTECH — Lazy Loading de Módulos
└── ADR-010_FRONTEND_STACKTECH — Versionado API y Backward Compatibility