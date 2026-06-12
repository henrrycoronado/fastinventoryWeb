import { useEffect } from 'react'
import { useAppStore } from '../../../core/store/useAppStore'
import toast from 'react-hot-toast'

export const useRestockNotifications = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const inventoryUrl = import.meta.env.VITE_INVENTORY_API_URL ?? 'http://localhost:5143'

  useEffect(() => {
    if (!companyCen) return

    const url = `${inventoryUrl}/api/inventory/companies/${companyCen}/restock-events`
    const source = new EventSource(url)

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        toast.success(`Restock: ${data.productName} +${data.quantity} unidades en ${data.warehouseName}`, {
          duration: 5000,
          icon: '📦'
        })
      } catch (err) {
        console.error('Error parsing SSE restock event', err)
      }
    }

    source.onerror = (err) => {
      console.error('SSE Connection Error:', err)
      source.close()
    }

    return () => {
      source.close()
    }
  }, [companyCen, inventoryUrl])
}
