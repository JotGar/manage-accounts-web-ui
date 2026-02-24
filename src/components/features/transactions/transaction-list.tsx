"use client"

import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"

interface Transaction {
  id: number
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

interface TransactionListProps {
  transactions: Transaction[]
  onDelete: (id: number) => void
  showActions?: boolean
}

export function TransactionList({ transactions, onDelete, showActions = true }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay transacciones registradas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
              {transaction.type === "income" ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium">{transaction.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {transaction.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{transaction.date}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </span>
            {showActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(transaction.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
