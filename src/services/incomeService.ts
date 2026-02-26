import { initialIngresos } from '@/src/data/mock-ingresos';
import type { Income, CreateIncomeInput } from '@/src/types';

// TODO: Implementar cuando tengas backend real
// Por ahora usa los datos mock

export const incomeService = {
  getAll: (): Income[] => {
    return initialIngresos;
  },

  getById: (id: number): Income | undefined => {
    return initialIngresos.find((i) => i.id === id);
  },

  create: (input: CreateIncomeInput): Income => {
    const newIncome: Income = {
      ...input,
      id: Math.max(0, ...initialIngresos.map((i) => i.id)) + 1,
    };
    return newIncome;
  },

  delete: (id: number): boolean => {
    const index = initialIngresos.findIndex((i) => i.id === id);
    if (index === -1) return false;
    return true;
  },
};