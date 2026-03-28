import { useMemo, useState } from 'react'
import { Search, Tag } from 'lucide-react'
import SectionHeader from '../../../components/SectionHeader'
import { useCompanyProducts, useGlobalCategories } from '../../inventory/services/inventoryHooks'
import type { CompanyProduct, GlobalCategory } from '../../inventory/services/types'

export default function MyCatalogCategories() {
	const { data: categories = [], isLoading } = useGlobalCategories()
	const { data: products = [] } = useCompanyProducts()
	const [search, setSearch] = useState('')

	const usedCategoryIds = useMemo(() => {
		const ids = new Set<number>()
		;(products as CompanyProduct[]).forEach(product => {
			const categoryId = product.globalProduct?.categoryId
			if (categoryId) ids.add(categoryId)
		})
		return ids
	}, [products])

	const productCountByCategory = useMemo(() => {
		const map: Record<number, number> = {}
		;(products as CompanyProduct[]).forEach(product => {
			const categoryId = product.globalProduct?.categoryId
			if (categoryId) map[categoryId] = (map[categoryId] ?? 0) + 1
		})
		return map
	}, [products])

	const filtered = useMemo(
		() =>
			(categories as GlobalCategory[]).filter(category =>
				category.name.toLowerCase().includes(search.toLowerCase())
			),
		[categories, search]
	)

	const sorted = useMemo(
		() =>
			[...filtered].sort(
				(a, b) =>
					(usedCategoryIds.has(b.id) ? 1 : 0) - (usedCategoryIds.has(a.id) ? 1 : 0)
			),
		[filtered, usedCategoryIds]
	)

	return (
		<div className="animate-fade-in">
			<SectionHeader
				title="Mis Categorías"
				subtitle={`${usedCategoryIds.size} categorías en uso en PDV`}
				right={
					<div className="relative">
						<Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
						<input
							className="input pl-8 w-52 text-xs"
							placeholder="Buscar categoría..."
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
				}
			/>

			<div className="mx-6 mt-4 card overflow-hidden mb-8">
				{isLoading ? (
					<div className="flex justify-center py-16 text-ink-muted text-sm">Cargando categorías…</div>
				) : sorted.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 gap-2">
						<Tag size={28} className="text-ink-muted" />
						<p className="text-sm text-ink-muted">Sin categorías encontradas</p>
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 px-6 py-3 border-b border-surface-4">
							<span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Categoría</span>
							<span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Productos</span>
						</div>

						<div className="divide-y divide-surface-3">
							{sorted.map(category => {
								const inUse = usedCategoryIds.has(category.id)
								const count = productCountByCategory[category.id] ?? 0

								return (
									<div
										key={category.id}
										className="grid grid-cols-2 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${inUse ? 'bg-accent/10' : 'bg-surface-4'}`}>
												<Tag size={13} className={inUse ? 'text-accent' : 'text-ink-muted'} />
											</div>
											<span className="text-sm font-medium text-ink-primary">{category.name}</span>
										</div>
										<span className="text-sm text-ink-secondary">
											{count > 0 ? `${count} producto${count > 1 ? 's' : ''}` : '—'}
										</span>
									</div>
								)
							})}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
