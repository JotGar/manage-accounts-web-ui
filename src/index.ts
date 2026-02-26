import { incomeService } from './services/incomeService';

const main = () => {
  console.log(incomeService.getAll());
  console.log(incomeService.getById(1));
  const nuevoIngreso = incomeService.create({
    name: 'Nuevo Ingreso',
    amount: 1000000,
    currency: 'COP',
    category: 'Trabajo',
    frequency: 'Mensual',
  });
  console.log(nuevoIngreso);
  console.log(incomeService.delete(1));
};

main();