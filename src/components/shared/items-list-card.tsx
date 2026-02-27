// ItemsListCard Component
// Componente reutilizable para mostrar una lista de items con icono (productos, presupuesto, inversiones)

import { Card, CardContent } from "@/src/components/ui/card"
import { formatCurrency } from "@/src/lib/utils"

interface ItemsListCardProps {
  title: string
  items: Array<{
    id: number
    name: string
    type?: string
    code?: string
    balance?: number
    currentAmount?: number
    currency?: string
    status?: string
  }>
  icon: React.ComponentType<{ className?: string }>
  darkMode?: boolean
  formatCurrencyFn?: (amount: number, currency?: string) => string
}

export function ItemsListCard({
  title,
  items,
  icon: Icon,
  darkMode = false,
  formatCurrencyFn = formatCurrency,
}: Readonly<ItemsListCardProps>) {
  return (
    <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <div 
              key={item.id !== undefined ? item.id : `item-${index}`} 
              className="flex justify-between items-center pb-3 border-b last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm sm:text-base">{item.name}</p>
                {item.type && (
                  <p className={`text-xs sm:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {item.type}
                  </p>
                )}
                {item.code && (
                  <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {item.code}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                  {formatCurrencyFn(
                    item.balance !== undefined
                      ? item.balance
                      : item.currentAmount ?? 0,
                    item.currency
                  )}
                </p>
                {item.status && (
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {item.status}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
