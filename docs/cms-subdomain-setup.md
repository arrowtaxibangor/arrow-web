# CMS Subdomain Setup — cms.arrow.taxi

## Overview

The admin dashboard runs on `cms.arrow.taxi`. The same Next.js deployment serves both
`arrow.taxi` (public site) and `cms.arrow.taxi` (admin). Middleware enforces host routing:
requests to `/admin/**` on `arrow.taxi` return 404; requests to non-admin paths on
`cms.arrow.taxi` redirect to `https://arrow.taxi`.

---

## 1. Vercel Domain Configuration

1. Go to **Vercel → Project → Settings → Domains**
2. Add `cms.arrow.taxi` as a custom domain
3. Vercel will show a CNAME record to add to your DNS

## 2. DNS

Add a CNAME record wherever `arrow.taxi` is registered:

| Type  | Name | Value                | TTL  |
| ----- | ---- | -------------------- | ---- |
| CNAME | cms  | cname.vercel-dns.com | 3600 |

Wait for DNS propagation (usually minutes, up to 24 h).

---

## 3. Environment Variables

Set in **Vercel → Project → Settings → Environment Variables** (Production + Preview):

| Variable                        | Description                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `SESSION_SECRET`                | Random 32+ char string. Generate: `openssl rand -base64 32`                      |
| `ADMIN_PASSWORD_HASH`           | bcrypt hash of admin password. Node.js: `require('bcryptjs').hashSync('pw', 12)` |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL (e.g. `https://db.arrow.taxi`)                              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key — safe to expose, used by the public client             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role key — **server-side only, never expose to client**                  |
| `NEXT_PUBLIC_BACKEND_URL`       | Arrow Taxi backend API base URL                                                  |
| `NEXT_PUBLIC_MAP_API_KEY`       | Google Maps JavaScript API key                                                   |

---

## 4. First Login

Navigate to `https://cms.arrow.taxi/admin/login`. Sign in with any email and the password
whose bcrypt hash is stored in `ADMIN_PASSWORD_HASH`.

Only the password is checked against the hash — the email field is not persisted.

---

## 5. On-Demand Revalidation

After every save the dashboard calls `POST /api/admin/revalidate`, which triggers Next.js
ISR for the affected slug. Changes appear on the public site within seconds, no rebuild needed.

---

## 6. Local Development

Middleware bypasses the host check for `localhost*`. Visit `http://localhost:3000/admin`
directly — no extra config required.

---

## 7. Security Notes

- Session cookie: `httpOnly: true`, `sameSite: lax`, `secure: true` (production)
- `SUPABASE_SERVICE_ROLE_KEY` is never bundled client-side
- All admin-mutating API routes verify iron-session before executing
- `arrow.taxi/admin/**` returns 404 at middleware level
