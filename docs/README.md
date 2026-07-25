# Grand Resort — How this app works

**Brand:** Grand Resort · Gwaldam Himalaya  
**Stack:** Next.js · Better Auth · Prisma · TanStack Query  

Single Next.js app. Lists update with **TanStack Query** (no full page reload for small data changes).

**Themes**
- **Public site** (home, hotels, auth, bookings): **light** (stone / white + amber)
- **Admin CMS** (`/admin/*`): **dark** premium shell

Brand constants: **`src/lib/brand.ts`**. Logo: **`src/components/brand/logo.tsx`**.

---

## Quick start

```bash
npm install
npm run db:seed
npm run dev
```

| Role | Email | Password |
|------|--------|----------|
| Admin | pradipbisht007@gmail.com | changeme |
| Guest | guest1@example.com | changeme123 |

---

## Main routes

| Path | Purpose |
|------|---------|
| `/` | Marketing home |
| `/hotels` | Live hotel list |
| `/hotels/[id]` | Rooms + book |
| `/login` · `/register` · `/verify-email` | Auth |
| `/bookings` | My bookings |
| `/admin` | Staff dashboard |
| `/admin/hotels` · `/rooms` · `/bookings` · `/users` | CMS |

---

## Folders (clean map)

| Path | Use for |
|------|---------|
| `src/lib/brand.ts` | Name, tagline, meta |
| `src/components/brand/` | Logo |
| `src/components/ux/` | Public UI (navbar, hero, sections) |
| `src/components/admin/` | Admin CMS |
| `src/components/hotels/` | Public hotels grid |
| `src/components/bookings/` | Book + my list |
| `src/components/auth/` | Auth forms |
| `src/lib/actions/` | Server CRUD |
| `src/lib/query-keys.ts` | Query cache keys |
| `prisma/` | Schema + seed |

---

## Auth steps

1. Register → OTP (terminal in dev) → verify  
2. Login → ADMIN goes to `/admin`, USER to `/dashboard`  
3. Logout clears session + Query cache  

---

## Booking steps

1. `/hotels` → property → room  
2. Sign in if needed  
3. Confirm dates → `/bookings`  
4. Admin: `/admin/bookings`  

---

## Admin inventory steps

1. `/admin/hotels` → Add hotel  
2. `/admin/rooms` → Add room (₹)  
3. Public `/hotels` stays in sync via Query invalidation  

---

## Live data (no full reload)

```text
useQuery → load section
useMutation → write
invalidateQueries → only that section refreshes
```

---

## Env

`DATABASE_URL` · `BETTER_AUTH_SECRET` · `BETTER_AUTH_URL` · `NEXT_PUBLIC_APP_URL`  
Auth API path: **`/auth/*`**

---

## Seed

```bash
npm run db:seed
```

Grand Resort + Alpine Lodge + Riverside Rest, rooms, guests, bookings.
