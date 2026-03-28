import { apiClient } from '../../../services/client'
import type {
	PdvMenuCreatePayload,
	PdvMenuItemCreatePayload,
	PdvOrderAddItemPayload,
	PdvOrderCreatePayload,
	PdvStationCategoryCreatePayload,
	PdvStationCreatePayload,
	PdvTableCreatePayload,
	PdvWaiterCreatePayload,
} from './types'

export const pdvApi = {
	tables: {
		list: (companyId: number) =>
			apiClient.get(`/api/companies/${companyId}/pdv/tables`).then(r => r.data),
		create: (companyId: number, data: PdvTableCreatePayload) =>
			apiClient.post(`/api/companies/${companyId}/pdv/tables`, data).then(r => r.data),
		delete: (companyId: number, id: number) =>
			apiClient.delete(`/api/companies/${companyId}/pdv/tables/${id}`).then(r => r.data),
	},

	waiters: {
		list: (companyId: number) =>
			apiClient.get(`/api/companies/${companyId}/pdv/waiters`).then(r => r.data),
		create: (companyId: number, data: PdvWaiterCreatePayload) =>
			apiClient.post(`/api/companies/${companyId}/pdv/waiters`, data).then(r => r.data),
		delete: (companyId: number, id: number) =>
			apiClient.delete(`/api/companies/${companyId}/pdv/waiters/${id}`).then(r => r.data),
	},

	menus: {
		list: (companyId: number) =>
			apiClient.get(`/api/companies/${companyId}/pdv/menus`).then(r => r.data),
		create: (companyId: number, data: PdvMenuCreatePayload) =>
			apiClient.post(`/api/companies/${companyId}/pdv/menus`, data).then(r => r.data),
		delete: (companyId: number, id: number) =>
			apiClient.delete(`/api/companies/${companyId}/pdv/menus/${id}`).then(r => r.data),
	},

	menuItems: {
		list: (menuId: number) =>
			apiClient.get(`/api/pdv/menus/${menuId}/items`).then(r => r.data),
		create: (menuId: number, data: PdvMenuItemCreatePayload) =>
			apiClient.post(`/api/pdv/menus/${menuId}/items`, data).then(r => r.data),
		delete: (menuId: number, id: number) =>
			apiClient.delete(`/api/pdv/menus/${menuId}/items/${id}`).then(r => r.data),
	},

	stations: {
		list: (companyId: number) =>
			apiClient.get(`/api/companies/${companyId}/pdv/stations`).then(r => r.data),
		create: (companyId: number, data: PdvStationCreatePayload) =>
			apiClient.post(`/api/companies/${companyId}/pdv/stations`, data).then(r => r.data),
		delete: (companyId: number, id: number) =>
			apiClient.delete(`/api/companies/${companyId}/pdv/stations/${id}`).then(r => r.data),
	},

	stationCategories: {
		list: (stationId: number) =>
			apiClient.get(`/api/pdv/stations/${stationId}/categories`).then(r => r.data),
		create: (stationId: number, data: PdvStationCategoryCreatePayload) =>
			apiClient.post(`/api/pdv/stations/${stationId}/categories`, data).then(r => r.data),
		delete: (stationId: number, id: number) =>
			apiClient.delete(`/api/pdv/stations/${stationId}/categories/${id}`).then(r => r.data),
	},

	orders: {
		list: (companyId: number) =>
			apiClient.get(`/api/companies/${companyId}/pdv/orders`).then(r => r.data),
		open: (companyId: number, data: PdvOrderCreatePayload) =>
			apiClient.post(`/api/companies/${companyId}/pdv/orders`, data).then(r => r.data),
		addItem: (companyId: number, orderId: number, warehouseId: number, data: PdvOrderAddItemPayload) =>
			apiClient.post(`/api/companies/${companyId}/pdv/orders/${orderId}/items?warehouseId=${warehouseId}`, data).then(r => r.data),
		updateItemStatus: (companyId: number, orderId: number, detailId: number, statusId: number) =>
			apiClient.patch(`/api/companies/${companyId}/pdv/orders/${orderId}/items/${detailId}/status?statusId=${statusId}`).then(r => r.data),
		checkout: (companyId: number, orderId: number, warehouseId: number) =>
			apiClient.post(`/api/companies/${companyId}/pdv/orders/${orderId}/checkout?warehouseId=${warehouseId}`).then(r => r.data),
		delete: (companyId: number, id: number) =>
			apiClient.delete(`/api/companies/${companyId}/pdv/orders/${id}`).then(r => r.data),
	},
}
