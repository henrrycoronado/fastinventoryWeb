import { categoryApi } from './categoryApi'
import { unitApi } from './unitApi'
import { productApi } from './productApi'
import { stockApi } from './stockApi'
import { documentApi } from './documentApi'
import { kardexApi } from './kardexApi'
import { warehouseApi } from './warehouseApi'
import { dashboardApi } from './dashboardApi'

export const inventoryApi = {
  categories: categoryApi,
  units: unitApi,
  products: productApi,
  stock: stockApi,
  documents: documentApi,
  kardex: kardexApi,
  warehouses: warehouseApi,
  dashboard: dashboardApi,
}
