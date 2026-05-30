---
project_name: 'my-udemy-frontend-admin'
user_name: 'Thang'
date: '2026-05-30'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'code_quality', 'workflow', 'critical_rules']
status: 'complete'
rule_count: 60
optimized_for_llm: true
---

# Project Context dành cho AI Agent

_File này chứa các quy tắc và pattern quan trọng mà AI agent phải tuân theo khi implement code trong dự án này. Tập trung vào các chi tiết không hiển nhiên mà agent có thể bỏ sót._

---

## Critical Don't-Miss Rules

### Anti-Patterns — AI agents trained on older docs will get these wrong

**Using outdated library patterns:**
- RQ v4 array syntax → must use v5 object syntax: `useQuery({ queryKey, queryFn })`
- RR v6 `<BrowserRouter>` → must use v7 `createBrowserRouter` + import from `react-router`
- AntD v4 global CSS import → AntD v5 uses CSS-in-JS, no import needed
- Zustand v3 single-call → v4 double-call `create<T>()()` with middleware

**Recreating what already exists:**
- Creating a new axios instance → always import `axiosInstance` from `src/api/axiosInstance.ts`
- Using AntD `<Modal>` directly → use `<AppModal>` wrapper
- Using AntD `<Pagination>` directly → use `<AppPagination>` wrapper
- Defining form types manually → always `type FormValues = z.infer<typeof schema>`

**State in the wrong layer:**
- Server-fetched data in Zustand → belongs in TanStack Query
- UI-only state in TanStack Query → belongs in Zustand or local `useState`
- Persisting server data in Zustand `persist` store → stale data on reload

**Inconsistent error handling:**
- Handling errors in both Axios interceptor AND React Query `onError` → double notifications
- Using `console.error` instead of `message.error()` from AntD
- Not using `getApiErrorMessage()` from `src/utils/helpers.ts` for error message extraction

### Silent Bugs — Only Appear After Cache Warms or Schema Changes
- `isLoading` instead of `isPending` in RQ v5 → wrong UI after first render cycle
- Missing `version` + `migrate` in Zustand `persist` when schema changes → data corruption from localStorage
- Missing cleanup in `useEffect` → memory leak (visible in StrictMode double-invoke)
- `onSuccess` callback in `useQuery` → silently never fires in RQ v5

### TypeScript Strict Violations That Break the Build
- Unused imports → compile error (`noUnusedLocals`)
- Unused params without `_` prefix → compile error (`noUnusedParameters`)
- WARNING: Do not delete a variable to fix the TS error — check if it's a `useEffect` dependency first

### Security
- Auth token is in localStorage via Zustand persist — never pass token in URL params
- Never log token or user credentials to console
- `VITE_*` env vars are exposed in the client bundle — never store secrets here

### Performance
- Import only specific icons: `import { PlusOutlined } from '@ant-design/icons'` — never the full icon set
- Zustand selectors must be specific: `useStore((s) => s.field)` — not `useStore()` to avoid unnecessary re-renders
- `xlsx`, vendor chunks already split in `vite.config.ts` `manualChunks` — do not alter chunking without reason

---

## Development Workflow Rules

### Branch Naming
- Feature branches: `feat/[short-description]` (e.g. `feat/publish-course`)
- Fix branches: `fix/[short-description]`
- Main branch: `main` — CI/CD deploys automatically on push to `main`

### Commit Message Format
```
type: short description in lowercase, no trailing period
```
- Types: `feat`, `fix`, `chore`, `refactor`, `docs`
- Examples: `feat: add publish course button`, `fix: reset form after submit`

### Pre-commit Gate (Husky)
- `eslint --fix --max-warnings 0` runs automatically on staged `*.{ts,tsx}`
- Do NOT bypass with `git commit --no-verify`
- Fix lint errors before committing — the hook will block the commit if warnings remain

### Scripts
| Command | Action |
|---------|--------|
| `npm run dev` | Vite dev server at `localhost:3000` |
| `npm run build` | `tsc` compile + Vite production build |
| `npm run lint` | ESLint with `--max-warnings 0` |
| `npm run preview` | Preview production build locally |

### CI/CD
- GitHub Actions on push to `main` → Docker Swarm deployment
- App runs on port `3001` in production (not 80, not 3000)
- Build must pass `tsc` (zero type errors) before deploy

### Required Environment Variables
```
VITE_API_BASE_URL          # API gateway base URL
VITE_AUTH_SERVICE_PREFIX   # Auth service path prefix
VITE_COURSE_SERVICE_PREFIX # Course service path prefix
```
- All env vars must be defined before `npm run build` — missing vars produce `undefined` silently at runtime

---

## Code Quality & Style Rules

### ESLint Configuration (`.eslintrc.cjs`)
- `@typescript-eslint/no-unused-vars`: **error** — argsIgnorePattern + varsIgnorePattern = `^_`
- `react-refresh/only-export-components`: warn — do not mix non-component exports in component files
- `react-hooks/recommended`: enforced — exhaustive-deps and rules-of-hooks violations fail lint
- `eslint:recommended` + `@typescript-eslint/recommended` baseline
- `--max-warnings 0` in lint-staged: **zero warnings allowed** — every warning fails the pre-commit hook

### Husky + lint-staged (Pre-commit Gate)
- Every commit runs: `eslint --fix --max-warnings 0` on staged `*.{ts,tsx}`
- Fix is attempted automatically; if unfixable warnings remain → commit is blocked
- Do NOT use `git commit --no-verify` to bypass hooks

### Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase.tsx | `CourseModal.tsx` |
| Hook / util / api / type files | camelCase.ts | `useCourses.ts`, `courseApi.ts` |
| Components & types | PascalCase | `CourseModal`, `ApiResponse<T>` |
| Hooks | `use` prefix | `useCourses`, `useCreateCourse` |
| Query key constants | SCREAMING_SNAKE_CASE | `COURSES_QUERY_KEY` |
| Unused param/var | `_` prefix | `_event`, `_unused` |

### Code Organization Within Files
1. External library imports
2. Internal imports (`@/` alias)
3. Relative imports
4. Props interface (immediately before component)
5. Component: hooks → derived state → handlers → JSX

### Comment Policy
- No comments explaining *what* the code does — naming handles that
- Only add a comment when the *why* is non-obvious (hidden constraint, workaround, subtle invariant)

### String & Formatting
- Single quotes for strings
- Semicolons required
- 2-space indentation
- No Prettier configured — ESLint handles style rules

---

## Framework-Specific Rules

### Project Structure (Feature-Based Architecture)
```
src/
├── api/           # [resource]Api.ts — one file per resource
├── components/    # common/ and layout/ — shared components only
├── config/        # env.ts — centralized env access
├── features/      # [feature]/components, hooks, pages, schemas
├── routes/        # AppRoutes.tsx + PrivateRoute.tsx
├── store/         # Zustand stores
├── types/         # [domain].types.ts
└── utils/         # helpers.ts
```
- New features go in `src/features/[feature-name]/` — never add feature-specific code to `src/components/`
- New shared components go in `src/components/common/` only if used by 2+ features

### React Component Rules
- All components are function components — no class components
- Use `<AppModal>` wrapper instead of `<Modal>` directly — provides `destroyOnClose` and `maskClosable={false}`
- Table loading state: use `<SkeletonTable rows={n} columns={n} />` — not raw AntD `<Skeleton>`
- Pagination: use `<AppPagination>` — not AntD `<Pagination>` directly

### Authentication Pattern
- Auth state in Zustand `authStore` with `persist` (localStorage key: `'auth-storage'`)
- Axios interceptor auto-injects `Authorization: Bearer {token}` via `useAuthStore.getState()` — not via React hook
- 401 response → auto `logout()` + redirect to `/login` (handled in `src/api/axiosInstance.ts`)
- Protected routes: `<PrivateRoute>` wrapper checks `isAuthenticated` from authStore

### API Layer
- One API module per resource: `src/api/[resource]Api.ts`
- All requests go through `axiosInstance` from `src/api/axiosInstance.ts` — never create a new axios instance
- Service URL pattern: `const BASE = \`${env.courseServicePrefix}/admin/[resource]\``
- API functions return raw `AxiosResponse<T>` — unwrap in hook's `select` option, not in the API function

### TanStack Query Patterns
- Separate query hooks from mutation hooks: `use[Resource]s.ts` vs `use[Resource]Actions.ts`
- Export query key as constant: `export const COURSES_QUERY_KEY = 'courses'`
- Use `invalidateQueries` in `onSettled` (not `onSuccess`) to ensure cache is refreshed even on error
- Optimistic update pattern (see `src/features/courses/hooks/useCourseActions.ts`):
```ts
onMutate: async (id) => {
  await qc.cancelQueries({ queryKey: [KEY] })
  const snapshots = qc.getQueriesData({ queryKey: [KEY] })
  // apply optimistic change to cache
  return { snapshots }
},
onError: (_err, _vars, ctx) => {
  ctx?.snapshots.forEach(([key, old]) => qc.setQueryData(key, old))
},
onSettled: () => qc.invalidateQueries({ queryKey: [KEY] })
```

### Form Pattern (react-hook-form + Zod + AntD)
- Schema file: `src/features/[feature]/schemas/[name]Schema.ts`
- Form type derived from schema in same file: `export type FormValues = z.infer<typeof schema>`
- Modal forms: reset in `useEffect` watching both `editing` and `open` props
- AntD Form submit: `<Form onFinish={handleSubmit(onSubmit)}>` + `<Button htmlType="submit">`
- Error display: `<Form.Item validateStatus={errors.field ? 'error' : ''} help={errors.field?.message}>`

### Routing
- Router defined in `src/routes/AppRoutes.tsx` using `createBrowserRouter`
- All authenticated routes nested under `<PrivateRoute>` → `<AppLayout>`
- Route params: `courseId`, `sectionId` — access via `useParams()` from `react-router`
- Navigation: `useNavigate()` hook — never `window.location.href` except for post-logout redirect

---

## Language-Specific Rules (TypeScript / JavaScript)

**Module System:** Project uses `"type": "module"` — ES Modules only, never CommonJS `require()`

**Import/Export Conventions:**
- Named exports for all components, hooks, utilities, and API modules
- Default export only in `src/App.tsx` — do not add default exports elsewhere
```ts
// ✅ CORRECT
export function CoursesPage() { ... }
export function useCourses() { ... }
// ❌ WRONG — no default exports for components/hooks
export default function CoursesPage() { ... }
```

**API Response Unwrapping:**
- API functions return raw `AxiosResponse<T>` — do NOT unwrap in the API layer
- Unwrap via TanStack Query `select` option at the hook level
```ts
// ✅ CORRECT — unwrap in hook
useQuery({ queryKey: [...], queryFn: () => courseApi.getAll(), select: (res) => res.data })
// ❌ WRONG — unwrapping in API layer
getAll: async () => (await axiosInstance.get(BASE)).data
```

**Error Handling:**
- Always extract error messages via `getApiErrorMessage()` from `src/utils/helpers.ts`
- All user-facing error display uses `message.error()` from Ant Design
- Never `console.error` as the only error handler in production code

**Pagination — 0-indexed vs 1-indexed:**
- UI state: 1-indexed (`const [page, setPage] = useState(1)`)
- API params: 0-indexed — always subtract 1 when passing to API (`page: page - 1`)
```ts
// ✅ CORRECT — see CoursesPage.tsx pattern
useCourses({ page: page - 1, size: pageSize })
```

**Naming Conventions:**
- Mutation rename on destructure: `const { mutate: createCourse, isPending: creating } = useCreateCourse()`
- Store selectors use arrow function: `useAuthStore((s) => s.accessToken)` — not whole-store subscription
- Query key constants are exported: `export const COURSES_QUERY_KEY = 'courses'`

**Type Conventions:**
- Domain types in `src/types/[domain].types.ts` — separate from business logic
- Use `ApiResponse<T>` and `PaginatedResponse<T>` from `src/types/api.types.ts` for all API shapes
- Never use `any` — use `unknown` with type narrowing if type is truly unknown
- Enum-like values use string union types, not TypeScript `enum`
```ts
// ✅ CORRECT
type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
// ❌ WRONG
enum CourseLevel { BEGINNER, INTERMEDIATE, ADVANCED }
```

**Async Patterns:**
- Use `async/await` — not `.then()/.catch()` chains
- TanStack Query handles async for data fetching — do not use `useState` + `useEffect` for server data

---

## Technology Stack & Versions

**Stack:** React 18.3.0 | TypeScript 5.4.0 | Vite 5.2.0 | Ant Design 5.15.0
| @tanstack/react-query 5.28.0 | Zustand 4.5.2
| react-hook-form 7.51.1 + @hookform/resolvers 3.3.4 + Zod 3.22.4
| react-router 7.1.0 | axios 1.6.8 | dayjs 1.11.10 | xlsx 0.18.5

**State Architecture Boundary** (critical — do not cross):
- Zustand = client/UI state only (auth token, theme, UI toggles)
- TanStack Query = ALL server state (fetched data, mutations)
- Never store server-fetched data in Zustand; never manually sync between the two

---

### [FATAL] — Build / Runtime Breaks

**TypeScript 5.4 strict: unused vars/params**
- RULE: Prefix unused params/vars with `_` (e.g. `_event`, `_index`)
- RULE: Remove all unused imports before committing
- CONSEQUENCE: `noUnusedLocals` + `noUnusedParameters` → compile error, build fails
- ANTI-PATTERN: Do NOT delete a variable just to fix the TS error — check if it's a useEffect dependency first

**TanStack Query v5: object syntax required**
```ts
// ✅ CORRECT
useQuery({ queryKey: ['courses'], queryFn: fetchCourses })
// ❌ WRONG — v4 syntax, TypeScript error + silent data failure
useQuery(['courses'], fetchCourses)
```

**TanStack Query v5: isPending — NOT isLoading for "first load"**
```ts
// ✅ CORRECT
const { isPending, isFetching } = useQuery(...)
// isPending  = no data ever fetched (true on first load)
// isFetching = any active network request (including background refetch)
// isLoading  = isPending && isFetching
// ❌ WRONG — isLoading semantic changed in v5; wrong behavior after cache warms
if (isLoading) return <Spinner />
```
- CONSEQUENCE: Wrong loading UI after first render; bug only appears after 2nd deploy

**TanStack Query v5: onSuccess/onError removed from useQuery**
```ts
// ❌ WRONG — callback never fires, no TypeScript error
useQuery({ queryKey: [...], queryFn: ..., onSuccess: () => {} })
// ✅ CORRECT — handle in useEffect
const { data } = useQuery({ queryKey: [...], queryFn: ... })
useEffect(() => { if (data) doSomething(data) }, [data])
```
- NOTE: onSuccess/onError are still valid in useMutation — only removed from useQuery/useQueries

**React Router 7: import from `react-router`**
```ts
// ✅ CORRECT
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router'
// ❌ WRONG — v6 habit
import { BrowserRouter } from 'react-router-dom'
```
- CONSEQUENCE: Wrong API surface; Data Router features silently unavailable

**Zustand 4.5: double-call `()()` with middleware**
```ts
// ✅ CORRECT
const useStore = create<StoreType>()(persist((set) => ({...}), { name: 'key' }))
// ❌ WRONG — missing outer ()
const useStore = create<StoreType>(persist((set) => ({...}), { name: 'key' }))
```
- CONSEQUENCE: TypeScript error + silent runtime bug

**React 18 lazy() + Suspense for route-level components**
- RULE: Route-level components using `React.lazy()` must be wrapped in `<Suspense>`
- CONSEQUENCE: Uncaught Promise rejection → app crash with blank screen

**Axios: baseURL must come from env var**
```ts
// ✅ CORRECT — see src/api/axiosInstance.ts
baseURL: import.meta.env.VITE_API_BASE_URL
// ❌ WRONG
baseURL: 'http://localhost:8080'
```
- CONSEQUENCE: Production build points to wrong URL; silent data failure in prod

**Vite 5: env vars and path alias**
- RULE: Prefix all env vars with `VITE_`, access via `import.meta.env` — never `process.env`
- RULE: Path alias `@/*` must be in BOTH `vite.config.ts` (resolve.alias) AND `tsconfig.json` (compilerOptions.paths) — missing either one → TypeScript or build failure

---

### [ERROR] — Functional Bugs (No Build Failure)

**Zustand persist: version + migrate on every schema change**
```ts
persist(creator, {
  name: 'auth-storage',
  version: 2, // increment on EVERY schema change
  migrate: (persistedState, version) => { ... }
})
```
- CONSEQUENCE: Old localStorage silently merged into new schema → data corruption

**TanStack Query: queryKey must be serialize-safe**
- RULE: queryKey arrays must contain only strings, numbers, booleans, null, or plain objects
- VIOLATION: No functions, no class instances, no undefined in queryKey
- CONSEQUENCE: Cache lookup fails silently; unpredictable refetch behavior

**Zustand: never mutate state directly in set()**
```ts
// ❌ WRONG
set((state) => { state.items.push(item); return state })
// ✅ CORRECT
set((state) => ({ items: [...state.items, item] }))
```

**React Router 7 + React Query: no loader/query mix**
- RULE: If using RR7 `loader` functions, do not also fetch the same resource in `useQuery`
- CONSEQUENCE: Duplicate requests, cache bypass, inconsistent UI state
- NOTE: Project uses React Query as primary data layer; RR7 is navigation-only

**React 18 StrictMode: useEffect cleanup**
- RULE: Every `useEffect` with subscriptions, timers, or fetch must return a cleanup function
- CONSEQUENCE: StrictMode double-invokes in dev; missing cleanup → production memory leaks

**Axios + React Query: single error handling point**
- RULE: Handle errors in ONE place — Axios response interceptor (`src/api/axiosInstance.ts`) is already configured; do NOT also add onError in individual query hooks
- CONSEQUENCE: Double toast notifications or silently swallowed errors

**react-hook-form: reset() after successful submit**
- RULE: Call `form.reset()` in `onSuccess` callback after mutation, not manual field clearing
- CONSEQUENCE: Dirty form state persists; validation errors from previous submit remain

**react-hook-form + Zod: always z.infer**
```ts
// ✅ CORRECT — stays in sync automatically
type FormValues = z.infer<typeof schema>
// ❌ WRONG — drifts from schema silently
interface FormValues { title: string }
```

**Ant Design 5.x: no global CSS import**
- RULE: Do NOT `import 'antd/dist/antd.css'`
- CONSEQUENCE: Some base styles broken (not a build failure)

---

### [CONVENTION] — Project Consistency

**AntD + react-hook-form: always use Controller**
```tsx
<Controller name="field" control={control}
  render={({ field }) => <Input {...field} />} />
```

**zodResolver import path**
```ts
import { zodResolver } from '@hookform/resolvers/zod'
```

**TanStack Query v5: renamed option** — `cacheTime` → `gcTime`

**Ant Design: ConfigProvider at app root** — see `src/App.tsx`

**AntD Table: rowKey required**
```tsx
// ✅ Always provide rowKey pointing to unique field
<Table rowKey="id" dataSource={courses} />
// ❌ Never rely on row index
```

**dayjs: plugin registration**
- Register all dayjs plugins in `src/main.tsx`
- If using AntD DatePicker: requires `rc-picker/lib/generate/dayjs` adapter — not just plugin registration

**xlsx: dynamic import preferred**
- Large library — use dynamic import to avoid bloating main bundle

**Axios instance: use existing instance**
- Never create a new `axios.create()` instance — always import from `src/api/axiosInstance.ts`

---

## Usage Guidelines

**For AI Agents:**
- Read this file in full before implementing any code in this project
- Follow ALL rules exactly — when in doubt, prefer the more restrictive option
- Check the [FATAL] section first — violations there break the build or cause silent runtime failure
- Reference `src/features/courses/` as the canonical example of correct patterns
- Update this file if new patterns emerge during implementation

**For Humans:**
- Keep this file lean — remove rules that become obvious over time
- Update when technology stack versions change
- Review quarterly for outdated rules
- Add new patterns discovered during code review

_Last Updated: 2026-05-30_
