import { Home, CreditCard, BarChart3, TrendingUp, Settings, ArrowUpDown } from "lucide-react"
import { FEATURES } from "@/src/config/features"

export const sidebarItems = [
  { id: "inicio",         label: "Inicio",         icon: Home },
  { id: "productos",      label: "Productos",       icon: CreditCard },
  { id: "transacciones",  label: "Transacciones",   icon: ArrowUpDown },
  ...(FEATURES.showBudget      ? [{ id: "presupuesto",   label: "Presupuesto",   icon: BarChart3 }]  : []),
  ...(FEATURES.showInvestments ? [{ id: "inversiones",   label: "Inversiones",   icon: TrendingUp }] : []),
  ...(FEATURES.showSettings    ? [{ id: "configuracion", label: "Configuración", icon: Settings }]   : []),
]
