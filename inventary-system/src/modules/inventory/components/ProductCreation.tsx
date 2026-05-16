import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategories, useUnits, useCreateProduct } from '../services/inventoryHooks'
import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'

export default function ProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: categories = [] } = useCategories()
  const { data: units = [] } = useUnits()
  const createProduct = useCreateProduct()

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    categoryCen: '',
    unitCen: '',
    salePrice: 0,
    costPrice: 0,
    reorderLevel: 0,
    stationCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProduct.mutateAsync(form)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="SKU / Código *" 
          placeholder="Ej: PROD-001" 
          value={form.sku} 
          onChange={e => setForm({...form, sku: e.target.value})} 
          required 
        />
        <Input 
          label="Nombre *" 
          placeholder="Ej: Producto de ejemplo" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Categoría</label>
          <select 
            className="input text-sm" 
            value={form.categoryCen} 
            onChange={e => setForm({...form, categoryCen: e.target.value})}
          >
            <option value="">Seleccionar...</option>
            {categories.map(c => <option key={c.categoryCen} value={c.categoryCen}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Unidad de medida *</label>
          <select 
            className="input text-sm" 
            value={form.unitCen} 
            onChange={e => setForm({...form, unitCen: e.target.value})}
            required
          >
            <option value="">Seleccionar...</option>
            {units.map(u => <option key={u.unitCen} value={u.unitCen}>{u.name} ({u.abbreviation})</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input 
          label="Precio Venta *" 
          type="number" 
          step="0.01" 
          value={form.salePrice} 
          onChange={e => setForm({...form, salePrice: parseFloat(e.target.value) || 0})} 
          required 
        />
        <Input 
          label="Costo Unitario" 
          type="number" 
          step="0.01" 
          value={form.costPrice} 
          onChange={e => setForm({...form, costPrice: parseFloat(e.target.value) || 0})} 
        />
        <Input 
          label="Stock Reorden" 
          type="number" 
          value={form.reorderLevel} 
          onChange={e => setForm({...form, reorderLevel: parseFloat(e.target.value) || 0})} 
        />
      </div>

      <Input 
        label="Descripción" 
        placeholder="Breve descripción del producto..." 
        value={form.description} 
        onChange={e => setForm({...form, description: e.target.value})} 
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={() => onSuccess?.()}>Cancelar</Button>
        <Button variant="primary" type="submit" loading={createProduct.isPending}>
          <Plus size={14} /> Crear Producto
        </Button>
      </div>
    </form>
  )
}
