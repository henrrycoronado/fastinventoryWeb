export interface PdvTable {
	id: number
	companyId: number
	name: string
	capacity?: number | null
	createdAt?: string | null
}

export interface PdvTableCreatePayload {
	name: string
	capacity?: number | null
}

export interface PdvWaiter {
	id: number
	companyId: number
	name: string
	createdAt?: string | null
}

export interface PdvWaiterCreatePayload {
	name: string
}

export interface PdvMenu {
	id: number
	companyId: number
	name: string
	createdAt?: string | null
}

export interface PdvMenuCreatePayload {
	name: string
}

export interface PdvMenuItem {
	id: number
	menuId: number
	skuId: number
	stationId?: number | null
	createdAt?: string | null
}

export interface PdvMenuItemCreatePayload {
	skuId: number
	stationId?: number | null
}

export interface PdvStation {
	id: number
	companyId: number
	name: string
	createdAt?: string | null
}

export interface PdvStationCreatePayload {
	name: string
}

export interface PdvStationCategory {
	id: number
	stationId: number
	globalCategoryId: number
	createdAt?: string | null
}

export interface PdvStationCategoryCreatePayload {
	globalCategoryId: number
}

export interface PdvOrder {
	id: number
	companyId: number
	warehouseId: number
	tableId: number
	waiterId: number
	statusId: number
	customerId?: number | null
	saleId?: number | null
	openedAt: string
	closedAt?: string | null
	createdAt?: string | null
}

export interface PdvOrderCreatePayload {
	warehouseId: number
	tableId: number
	waiterId: number
	customerId?: number | null
}

export interface PdvOrderDetail {
	id: number
	orderId: number
	menuItemId: number
	stationId?: number | null
	statusId: number
	quantity: number
	unitPrice: number
	notes?: string | null
	createdAt?: string | null
}

export interface PdvOrderAddItemPayload {
	menuItemId: number
	stationId?: number | null
	quantity: number
	unitPrice: number
	notes?: string
}
