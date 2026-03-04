# Coding Standards - Manage Accounts Web UI

## Project Context
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Package Manager**: pnpm
- **Source Directory**: `/src`

---

## File Naming Conventions

### PascalCase (React Components - .tsx)
```
✅ Correct:
- ProductsSection.tsx
- TransactionForm.tsx
- BudgetSection.tsx
- InvestmentForm.tsx

❌ Incorrect:
- products-section.tsx
- transaction_form.tsx
```

### kebab-case (Hooks, Services, Utils, Types - .ts)
```
✅ Correct:
- use-products.ts
- use-transactions.ts
- storage-keys.ts
- calculations.ts

❌ Incorrect:
- useProducts.ts
- StorageKeys.ts
- Calculations.ts
```

---

## TypeScript Naming

### Interfaces & Types (PascalCase)
```typescript
✅ Correct:
interface Product { ... }
interface Transaction { ... }
type FixedIncome = BudgetItem
type BudgetCategory = "Salary" | "Freelance" | ...

❌ Incorrect:
interface producto { ... }
type ingresoFijo = BudgetItem
```

### Variables & Functions (camelCase)
```typescript
✅ Correct:
const products = getProducts()
const totalBalance = calculateTotalBalance(items)
function addProduct(product: Product) { ... }

❌ Incorrect:
const Productos = getProducts()
const total_balance = calculateTotalBalance(items)
function AddProduct(product: Product) { ... }
```

### Constants (UPPER_SNAKE_CASE)
```typescript
✅ Correct:
const STORAGE_KEYS = {
  PRODUCTS: "finance-app-products",
  FIXED_INCOMES: "finance-app-fixed-incomes",
} as const

const MAX_RETRY_ATTEMPTS = 3

❌ Incorrect:
const StorageKeys = { ... }
const maxRetryAttempts = 3
```

---

## Language

### Code in English
All code, comments, and internal variables must be in English.

```typescript
✅ Correct:
// Get all products from storage
const products = getStoredProducts()
const addProduct = useCallback((input: CreateProductInput) => { ... })

❌ Incorrect:
// Obtener todos los productos
const productos = obtenerProductos()
```

### User-Facing Text in Spanish
Labels, buttons, messages, and UI text should remain in Spanish.

```typescript
✅ Correct:
<Button>Agregar Producto</Button>
<span>Saldo Disponible</span>
<p>Cuenta eliminada exitosamente</p>
```

---

## Project Structure

```
src/
├── components/
│   ├── features/          # Feature-based components
│   │   ├── budgets/
│   │   ├── products/
│   │   ├── transactions/
│   │   └── investments/
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── shared/           # Reusable components across features
│   └── ui/               # shadcn/ui components (DO NOT MODIFY)
├── hooks/                 # Custom React hooks (kebab-case)
├── services/              # Business logic & data persistence
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
├── constants/             # App constants (storage keys, config)
├── data/                  # Mock data for development
└── config/                # Feature flags and configuration
```

---

## Import Conventions

### Use Path Aliases
```typescript
✅ Correct:
import { useProducts } from "@/src/hooks"
import { formatCurrency } from "@/src/lib/utils"
import { Product } from "@/src/types/products"

❌ Incorrect:
import { useProducts } from "../../hooks/use-products"
```

---

## Component Patterns

### Functional Components with TypeScript
```typescript
interface ProductsSectionProps {
  products: Product[]
  onAddProduct: (product: CreateProductInput) => void
  onDeleteProduct: (id: number) => void
  formatCurrency: (amount: number, currency?: string) => string
  darkMode?: boolean
}

export function ProductsSection({
  products,
  onAddProduct,
  formatCurrency,
  darkMode = false,
}: ProductsSectionProps) {
  // Component logic
}
```

### Hooks Pattern
```typescript
// File: use-products.ts (kebab-case)
export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  
  // Hook logic
  
  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
```

---

## Best Practices

### 1. Always use explicit types for props
```typescript
✅ Correct:
interface Props {
  name: string
  count: number
}

❌ Incorrect:
interface Props {
  name
  count
}
```

### 2. Use optional chaining and nullish coalescing
```typescript
✅ Correct:
const balance = product?.balance ?? 0
const name = product?.name || "Unknown"

❌ Incorrect:
const balance = product.balance ? product.balance : 0
```

### 3. Prefer const over let
```typescript
✅ Correct:
const total = products.reduce((sum, p) => sum + p.balance, 0)

❌ Incorrect:
let total = 0
products.forEach(p => total += p.balance)
```

### 4. Use early returns
```typescript
✅ Correct:
if (!isAuthenticated) {
  return <LoginPrompt />
}

return <Dashboard />

❌ Incorrect:
return (
  <div>
    {isAuthenticated && <Dashboard />}
    {!isAuthenticated && <LoginPrompt />}
  </div>
)
```

---

## Git Commit Messages

Follow conventional commits:
- `feat: add new product form`
- `fix: resolve budget calculation error`
- `refactor: standardize naming to English`
- `docs: update README`
- `chore: update dependencies`

---

## Git Workflow Rules

### 🚫 NO Git Operations Without User Permission
**Always wait for explicit user instruction before performing any Git operations.**

- ❌ DO NOT create branches automatically
- ❌ DO NOT commit changes automatically  
- ❌ DO NOT push to remote without permission
- ❌ DO NOT create or merge PRs without approval

✅ Only execute Git commands when the user explicitly asks for it.

### When User Asks for Git Operations
When instructed, follow these conventions:

1. **Create Branch**: Use descriptive names with prefixes:
   - `feat/` for new features
   - `fix/` for bug fixes
   - `refactor/` for code refactoring
   - `docs/` for documentation
   
2. **Commits**: Use conventional commits format

3. **PR Description**: Include:
   - Summary of changes
   - List of modified files
   - Breaking changes if any
   - Testing notes

---

## Testing (Future)

When adding tests:
- Unit tests: `*.test.ts` or `*.spec.ts`
- Component tests: `*.test.tsx`
- Test utilities: `src/__tests__/` or `src/test/`

---

## Notes

### DO NOT MODIFY
- `/src/components/ui/*` - These are shadcn/ui components managed by the CLI
- Update via: `npx shadcn@latest add [component-name]`

### Be Careful With
- `tailwind.config.ts` - Custom theme configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
