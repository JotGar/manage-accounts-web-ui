import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface BalanceCardProps {
  title: string
  amount: number
  icon: LucideIcon
  trend: "positive" | "negative" | "neutral"
  isCount?: boolean
  darkMode?: boolean
}

export function BalanceCard({ title, amount, icon: Icon, trend, isCount = false, darkMode = false }: BalanceCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const formatAmount = () => {
    if (isCount) {
      return amount.toString()
    }
    return `$${amount.toFixed(2)}`
  }

  return (
    <Card className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${darkMode ? "text-gray-200" : ""}`}>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getTrendColor()}`}>{formatAmount()}</div>
        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-muted-foreground"}`}>
          {trend === "positive" && !isCount && "Ingresos totales"}
          {trend === "negative" && "Gastos totales"}
          {trend === "neutral" && "Total registradas"}
          {trend === "positive" && isCount && "Balance actual"}
        </p>
      </CardContent>
    </Card>
  )
}
