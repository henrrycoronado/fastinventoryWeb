import { useState } from 'react'
import { Search } from 'lucide-react'
import SectionHeader from '../../../components/SectionHeader'
import { MyCompanyView } from '../../inventory/components/ProductViews'

export default function MyCatalogProducts() {
	const [search, setSearch] = useState('')

	return (
		<div className="animate-fade-in">
			<SectionHeader
				title="Mis Productos"
				subtitle="Catálogo de productos disponibles para Punto de Venta"
				right={
					<div className="relative">
						<Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
						<input
							className="input pl-8 w-52 text-xs"
							placeholder="Buscar por SKU o nombre..."
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
				}
			/>

			<div className="mx-6 mt-4 card overflow-hidden mb-8">
				<MyCompanyView search={search} />
			</div>
		</div>
	)
}
