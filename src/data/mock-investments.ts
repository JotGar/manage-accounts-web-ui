// data/mock-investments.ts
import { Investment } from "../types/investment"

export const mockInvestments: Investment[] = [
  {
    id: 1,
    name: "Apartamento Bora",
    type: "Bienes Raíces",
    initialAmount: 150000000,
    currentAmount: 165000000,
    currency: "COP",
    expectedReturn: 8.5,
    startDate: "2023-01-15",
    status: "Activa",
    adjustments: [
      {
        id: 1,
        date: "2024-01-15",
        previousAmount: 150000000,
        newAmount: 165000000,
        reason: "Valorización anual",
        type: "increase",
      },
    ],
  },
  {
    id: 2,
    name: "Acciones ETF S&P 500",
    type: "Acciones",
    initialAmount: 5000000,
    currentAmount: 5750000,
    currency: "COP",
    expectedReturn: 12.0,
    startDate: "2023-06-01",
    status: "Activa",
    adjustments: [
      {
        id: 1,
        date: "2024-01-01",
        previousAmount: 5000000,
        newAmount: 5750000,
        reason: "Crecimiento del mercado",
        type: "increase",
      },
    ],
  },
  {
    id: 3,
    name: "CDT Banco Popular",
    type: "CDT",
    initialAmount: 10000000,
    currentAmount: 10600000,
    currency: "COP",
    expectedReturn: 6.0,
    startDate: "2023-03-01",
    status: "Activa",
    adjustments: [],
  },
]
