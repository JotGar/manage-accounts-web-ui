import type { Income, CreateIncomeInput } from '@/src/types';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { getLocalStorage } from '../lib/storage';

const getStoredProducts = (): Income[] => {
  return getLocalStorage<Income[]>(STORAGE_KEYS.FIXED_INCOMES, [])
}

export const incomeService = {
  getAll: (): Income[] => {
    return getStoredProducts();
  },

  getById: (id: number): Income | undefined => {
    const incomes = getStoredProducts();
    return incomes.find((i) => i.id === id);
  },

  create: (input: CreateIncomeInput): Income => {
    const initialIngresos = getStoredProducts();

    const newIncome: Income = {
      ...input,
      id: Math.max(0, ...initialIngresos.map((i) => i.id)) + 1,
    };
    return newIncome;
  },

  delete: (id: number): boolean => {
    const initialIngresos = getStoredProducts();

    const index = initialIngresos.findIndex((i) => i.id === id);
    if (index === -1) return false;
    return true;
  },
};