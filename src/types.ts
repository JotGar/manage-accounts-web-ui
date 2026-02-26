export type Income = {
  id: number;
  name: string;
  amount: number;
  currency: string;
  category: string;
  frequency: string;
};

export type CreateIncomeInput = {
  name: string;
  amount: number;
  currency: string;
  category: string;
  frequency: string;
};