# Next.js + MongoDB Boilerplate (Adaptado a tus modelos)

Incluye:
- Next.js 14 (App Router)
- MongoDB/Mongoose con conexión cacheada
- Autenticación JWT con cookies httpOnly usando `name` como username
- DTOs con Zod
- CRUD de: Category, CategoryBudget, Income, Expense, SavingProject, User
- `auditable` autogenerado en POST y actualizado en PUT
- `populate` de `category` en Income/Expense

## Uso
```bash
npm i
cp .env.example .env.local
# Edita .env.local con tu MONGODB_URI y JWT_SECRET
npm run dev
```

### Endpoints
- `GET /api/health`
- Auth (usa name+password):
  - `POST /api/auth/register` { name, password }
  - `POST /api/auth/login` { name, password }
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- `GET|POST /api/categories`
- `GET|PUT|DELETE /api/categories/:id`
- `GET|POST /api/category-budgets`
- `GET|PUT|DELETE /api/category-budgets/:id`
- `GET|POST /api/incomes`
- `GET|PUT|DELETE /api/incomes/:id`
- `GET|POST /api/expenses`
- `GET|PUT|DELETE /api/expenses/:id`
- `GET|POST /api/saving-projects`
- `GET|PUT|DELETE /api/saving-projects/:id`
- `GET|POST /api/users` (admin/demo)
- `GET|PUT|DELETE /api/users/:id` (admin/demo)

**Protección**: todas las rutas salvo `/api/health` y `/api/auth/*` requieren cookie `token` válida.
