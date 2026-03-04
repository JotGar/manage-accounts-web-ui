import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, currency?: string): string => {
    const curr = currency || "COP";
    
    const currencyConfig = {
      COP: { locale: "es-CO", currency: "COP" },
      EUR: { locale: "es-ES", currency: "EUR" },
      USD: { locale: "en-US", currency: "USD" },
      GBP: { locale: "en-GB", currency: "GBP" },
      JPY: { locale: "ja-JP", currency: "JPY" },
    }

    const config = currencyConfig[curr as keyof typeof currencyConfig] || currencyConfig.COP

    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.currency,
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  }
