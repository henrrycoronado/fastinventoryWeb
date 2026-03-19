import { Printer } from 'lucide-react'
import { formatCurrency, formatDate } from '../../../lib/utils'
import { useAppStore } from '../../../store/useAppStore'
import type { Sale, Receipt } from '../services/types'
import toast from 'react-hot-toast'

interface ReceiptTicketProps {
  sale: Sale
  receipt: Receipt
}

export default function ReceiptTicket({ sale, receipt }: ReceiptTicketProps) {
  const { selectedCompany, selectedWarehouse } = useAppStore()

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (!printWindow) {
      toast.error('Por favor, permite las ventanas emergentes en tu navegador para imprimir.')
      return
    }

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo #${receipt.id}</title>
        <style>
          @page { 
            size: 5mm auto; 
            margin: 5mm auto; 
          }
          body { 
            font-family: monospace; 
            font-size: 12px; 
            color: black; 
            background: white; 
            margin: 100px; 
            padding: 15px;
            width: 80mm; /* Ancho estándar de impresora térmica */
          }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .border-bottom { border-bottom: 1px dashed black; padding-bottom: 10px; margin-bottom: 10px; }
          .border-top { border-top: 1px dashed black; padding-top: 10px; margin-bottom: 10px; }
          .flex-between { display: flex; justify-content: space-between; }
          .mt-2 { margin-top: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        </style>
      </head>
      <body>
        <div class="center border-bottom">
          <h2 class="bold" style="font-size: 16px; margin:0;">${selectedCompany?.name || 'Empresa'}</h2>
          <p style="margin: 2px 0;">${selectedWarehouse?.name}</p>
          <p style="margin: 2px 0;">Recibo #${receipt.id.toString().padStart(6, '0')}</p>
          <p style="margin: 2px 0;">${formatDate(receipt.issuedAt)}</p>
        </div>

        <div class="mb-4">
          <div class="flex-between"><span>Cliente:</span><span class="bold">${sale.customer?.name || 'Consumidor Final'}</span></div>
          <div class="flex-between"><span>Vendedor:</span><span class="bold">${sale.seller?.name || 'Sin asignar'}</span></div>
          <div class="flex-between"><span>Venta Ref:</span><span>#${sale.id.toString().padStart(6, '0')}</span></div>
        </div>

        <div class="border-top border-bottom">
          <div class="flex-between bold" style="margin-bottom: 8px;"><span>CANT x PROD</span><span>SUB</span></div>
          ${sale.details?.map(d => `
            <div style="margin-bottom: 6px;">
              <p style="margin: 0;" class="truncate">${d.sku?.productName ?? `SKU #${d.skuId}`}</p>
              <div class="flex-between">
                <span>${d.quantity} x ${formatCurrency(d.unitPrice)}</span>
                <span>${formatCurrency(d.subtotal)}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="flex-between bold" style="font-size: 14px;">
          <span>TOTAL:</span><span>${formatCurrency(receipt.totalAmount)}</span>
        </div>

        <div class="center mt-2" style="color: #333;">
          <p style="margin: 4px 0;">¡Gracias por su compra!</p>
          <p style="margin: 4px 0; font-size: 10px;">Vuelva pronto</p>
        </div>

        <script>
          // Imprimimos y cerramos la ventana automáticamente
          window.onload = function() {
            window.print();
            // Le damos un pequeño retraso para que el navegador procese el diálogo de impresión antes de cerrar
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(ticketHTML)
    printWindow.document.close()
  }

  return (
    <div className="flex flex-col items-center w-full">
      <button onClick={handlePrint} className="btn-primary text-sm mb-4 w-full justify-center">
        <Printer size={14} /> Imprimir Ticket
      </button>

      <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-[320px] font-mono text-sm">
        <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-4">
          <h2 className="font-bold text-lg uppercase">{selectedCompany?.name || 'Empresa'}</h2>
          <p className="text-xs mt-1">{selectedWarehouse?.name}</p>
          <p className="text-xs">Recibo #{receipt.id.toString().padStart(6, '0')}</p>
          <p className="text-xs mt-2">{formatDate(receipt.issuedAt)}</p>
        </div>

        <div className="space-y-1 mb-4 text-xs">
          <div className="flex justify-between"><span>Cliente:</span><span className="font-medium truncate ml-2">{sale.customer?.name || 'Consumidor Final'}</span></div>
          <div className="flex justify-between"><span>Vendedor:</span><span className="font-medium truncate ml-2">{sale.seller?.name || 'Sin asignar'}</span></div>
          <div className="flex justify-between"><span>Venta Ref:</span><span>#{sale.id.toString().padStart(6, '0')}</span></div>
        </div>

        <div className="border-t border-b border-dashed border-gray-400 py-3 mb-4 space-y-2">
          <div className="flex justify-between font-bold text-xs"><span>CANT x PROD</span><span>SUB</span></div>
          {sale.details?.map(d => {
            const nombre = d.sku?.productName ?? `SKU #${d.skuId}`
            return (
              <div key={d.id} className="text-xs">
                <p className="truncate pr-2">{nombre}</p>
                <div className="flex justify-between">
                  <span>{d.quantity} x {formatCurrency(d.unitPrice)}</span>
                  <span>{formatCurrency(d.subtotal)}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-right space-y-1 mb-6">
          <div className="flex justify-between font-bold text-base"><span>TOTAL:</span><span>{formatCurrency(receipt.totalAmount)}</span></div>
        </div>

        <div className="text-center text-xs text-gray-500"><p>¡Gracias por su compra!</p><p className="mt-1 text-[10px]">Vuelva pronto</p></div>
      </div>
    </div>
  )
}