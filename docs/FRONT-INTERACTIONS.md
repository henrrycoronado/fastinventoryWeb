# Frontend Interactions - API Gateway

> Generated: 16 May 2026
> Contract source: docs/inventory.json, docs/purchase.json, docs/sale.json

This gateway proxies the Inventory, Purchases, and Sales APIs and wraps every successful response in the standard frontend envelope.

---

## 1) Base HTTP Client

- Base URL: VITE_API_URL (example: http://localhost:3000)
- Content-Type: application/json
- Auth: none (no token required for now)

### Response Envelope (always)

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

Errors are returned as:

```json
{
  "success": false,
  "data": null,
  "message": "Error message"
}
```

### IDs

All resource identifiers are business references (CEN) and are strings.

---

## 2) Contract Source of Truth

The gateway does not change request or response shapes from the upstream APIs. The exact payloads (fields, types, required properties) are defined in these OpenAPI files:

- Inventory: docs/inventory.json
- Purchases: docs/purchase.json
- Sales: docs/sale.json

Use these files to generate frontend types and validate requests. The gateway only adds the response wrapper described above.

---

## 3) Inventory Module

Gateway exposes all endpoints from docs/inventory.json (same paths and payloads). Use CEN strings for path parameters.

Endpoints:

- GET  /api/inventory/companies/{companyCen}/dashboard
- GET  /api/inventory/companies/{companyCen}/categories
- POST /api/inventory/companies/{companyCen}/categories
- PUT  /api/inventory/companies/{companyCen}/categories/{categoryCen}
- GET  /api/inventory/companies/{companyCen}/units
- POST /api/inventory/companies/{companyCen}/units
- PUT  /api/inventory/companies/{companyCen}/units/{unitCen}
- GET  /api/inventory/companies/{companyCen}/warehouses
- POST /api/inventory/companies/{companyCen}/warehouses
- PUT  /api/inventory/companies/{companyCen}/warehouses/{warehouseCen}
- GET  /api/inventory/companies
- POST /api/inventory/companies
- GET  /api/inventory/companies/{companyCen}
- PUT  /api/inventory/companies/{companyCen}
- GET  /api/inventory/companies/{companyCen}/documents
- POST /api/inventory/companies/{companyCen}/documents
- GET  /api/inventory/companies/{companyCen}/products/{productCen}/kardex
- GET  /api/inventory/companies/{companyCen}/products
- POST /api/inventory/companies/{companyCen}/products
- POST /api/inventory/companies/{companyCen}/products/lookup
- PUT  /api/inventory/companies/{companyCen}/products/{productCen}
- PATCH /api/inventory/companies/{companyCen}/products/{productCen}/status
- GET  /api/inventory/companies/{companyCen}/sellable-products
- GET  /api/inventory/companies/{companyCen}/stock
- POST /api/inventory/companies/{companyCen}/stock/validate
- POST /api/inventory/companies/{companyCen}/stock/consume
- POST /api/inventory/companies/{companyCen}/stock/increase
- POST /api/inventory/companies/{companyCen}/stock/adjustments

Request bodies, query params, and response schemas for each endpoint are defined in docs/inventory.json (paths -> requestBody, parameters, responses, components/schemas).

---

## 4) Purchases Module

Gateway exposes all endpoints from docs/purchase.json (same paths and payloads). Use CEN strings for path parameters.

Endpoints:

- POST /api/purchases/companies
- PUT  /api/purchases/companies/{companyCen}
- POST /api/purchases/companies/{companyCen}/warehouses
- PUT  /api/purchases/companies/{companyCen}/warehouses/{warehouseCen}
- GET  /api/purchases/companies/{companyCen}/suppliers
- POST /api/purchases/companies/{companyCen}/suppliers
- PUT  /api/purchases/companies/{companyCen}/suppliers/{supplierCen}
- GET  /api/purchases/companies/{companyCen}/orders
- POST /api/purchases/companies/{companyCen}/orders
- GET  /api/purchases/companies/{companyCen}/orders/{orderCen}
- POST /api/purchases/companies/{companyCen}/orders/{orderCen}/confirm

Request bodies, query params, and response schemas for each endpoint are defined in docs/purchase.json (paths -> requestBody, parameters, responses, components/schemas).

---

## 5) Sales Module

Gateway exposes all endpoints from docs/sale.json (same paths and payloads). Use CEN strings for path parameters.

Endpoints:

- GET  /api/sales/companies/{companyCen}/catalog/products
- POST /api/sales/companies
- PUT  /api/sales/companies/{companyCen}
- GET  /api/sales/companies/{companyCen}/dashboard/daily-sales
- GET  /api/sales/companies/{companyCen}/dashboard/top-products
- GET  /api/sales/companies/{companyCen}/dashboard/kds-status
- GET  /api/sales/companies/{companyCen}/kds/teams
- POST /api/sales/companies/{companyCen}/kds/teams
- GET  /api/sales/companies/{companyCen}/kds/teams/{teamCen}/items
- PATCH /api/sales/companies/{companyCen}/kds/items/{ticketItemCen}/status
- PUT  /api/sales/companies/{companyCen}/kds/teams/{teamCen}
- GET  /api/sales/payment-methods
- GET  /api/sales/companies/{companyCen}/tax-configuration
- PUT  /api/sales/companies/{companyCen}/tax-configuration
- POST /api/sales/companies/{companyCen}/tickets/{ticketCen}/payment
- GET  /api/sales/companies/{companyCen}/tickets
- POST /api/sales/companies/{companyCen}/tickets
- GET  /api/sales/companies/{companyCen}/tickets/{ticketCen}/items
- POST /api/sales/companies/{companyCen}/tickets/{ticketCen}/items
- PATCH /api/sales/companies/{companyCen}/tickets/{ticketCen}/items/{ticketItemCen}
- POST /api/sales/companies/{companyCen}/tickets/{ticketCen}/items/{ticketItemCen}/resend
- POST /api/sales/companies/{companyCen}/tickets/{ticketCen}/send
- PUT  /api/sales/companies/{companyCen}/tickets/{ticketCen}/waiter
- POST /api/sales/companies/{companyCen}/tickets/{ticketCen}/cancel
- GET  /api/sales/companies/{companyCen}/tickets/{ticketCen}/print
- GET  /api/sales/companies/{companyCen}/tickets/{ticketCen}/totals
- GET  /api/sales/companies/{companyCen}/waiters
- POST /api/sales/companies/{companyCen}/waiters
- PUT  /api/sales/companies/{companyCen}/waiters/{waiterCen}

Request bodies, query params, and response schemas for each endpoint are defined in docs/sale.json (paths -> requestBody, parameters, responses, components/schemas).

---

## 6) Notes for Frontend Migration

- Replace all numeric IDs with CEN strings.
- Remove old endpoints not present in the OpenAPI files.
- Add the new Purchases module pages and connections based on docs/purchase.json.
- Sales and Inventory should follow their updated contracts as defined in docs/sale.json and docs/inventory.json.

---

## 7) Example Usage

Request:

```http
GET /api/inventory/companies/COMP-001/products
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "productCen": "PROD-001",
      "name": "Burger",
      "categoryCen": "CAT-01"
    }
  ],
  "message": "OK"
}
```

The response body is always wrapped in the envelope; the data content matches the OpenAPI schema for the endpoint.
