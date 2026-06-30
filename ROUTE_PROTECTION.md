# Route Protection Strategy

## Overview

This project implements a **two-layer route protection** system using Next.js middleware and client-side hooks to prevent unauthorized access to protected routes.

## Protected Routes

The following routes require authentication:

```
/dashboard
/audit
/crawl
/compare
/history
/rank-tracking
/backlinks
/keywords
/platform
/audit/embed
/audit/[jobId]
/crawl/[jobId]
/compare/[jobId]
```

## Public Routes

The following routes are accessible without authentication:

```
/                    (Landing page)
/signin
/register
/blog
/blog/[slug]
/pricing
/privacy
/terms
/use-cases
/use-cases/[slug]
```

## Implementation

### 1. Middleware-Level Protection (`middleware.ts`)

**Location:** `middleware.ts` at root

**How it works:**
- Runs on every request before it reaches the application
- Checks for `access_token` in request cookies
- For protected routes without a token → redirects to `/signin?redirect={original-path}`
- For signin/register pages with a token → redirects to `/dashboard`

**Advantages:**
- Server-side validation - cannot be bypassed by client-side code manipulation
- Instant redirect before page loads
- Reduces unnecessary component renders

**Cookie Setup Required:**
When users sign in, ensure the API sets:
```javascript
// Backend should set HttpOnly cookie
Set-Cookie: access_token=<token>; HttpOnly; Secure; SameSite=Strict
```

If using localStorage, update the middleware to check it (currently checks cookies only):
```typescript
const token = request.cookies.get('access_token')?.value || 
             request.headers.get('cookie')?.split('access_token=')[1]?.split(';')[0]
```

---

### 2. Client-Side Protection Hook (`lib/protected-route.ts`)

**Location:** `lib/protected-route.ts`

**Hook: `useProtectedRoute(redirectTo?: string)`**

Usage in protected pages:
```tsx
'use client'

import { useProtectedRoute } from '@/lib/protected-route'

export default function ProtectedPage() {
  const { user, loading, isProtected } = useProtectedRoute('/dashboard')
  
  if (loading) return <LoadingSpinner />
  if (!isProtected) return null // Will auto-redirect
  
  return <ProtectedContent user={user} />
}
```

**Returns:**
- `user`: Current authenticated user or null
- `loading`: Whether auth state is being loaded
- `isProtected`: Boolean indicating if user has access

**Features:**
- Waits for auth context to load
- Automatically redirects unauthenticated users to signin
- Captures current path to redirect back after login

---

## Protected Pages

All the following pages have been updated with client-side protection:

### ✅ Updated Pages
1. **Dashboard** (`app/dashboard/page.tsx`)
2. **Website Audit** (`app/audit/page.tsx`)
3. **Deep Crawl** (`app/crawl/page.tsx`)
4. **Competitor Compare** (`app/compare/page.tsx`)
5. **Activity History** (`app/history/page.tsx`)
6. **Embed Widget Settings** (`app/audit/embed/page.tsx`)

### Pages Still Needing Updates
- Rank Tracking (`/rank-tracking`)
- Backlink Analysis (`/backlinks`)
- Keyword Analysis (`/keywords`)
- Platform Admin (`/platform`)
- Audit Results (`/audit/[jobId]`)
- Crawl Results (`/crawl/[jobId]`)
- Compare Results (`/compare/[jobId]`)

**To update remaining pages:**
```tsx
import { useProtectedRoute } from '@/lib/protected-route'

export default function PageName() {
  const { isProtected } = useProtectedRoute()
  
  // Page content...
}
```

---

## Sign-In Flow

### User Journey

1. **Unauthenticated user visits protected route**
   - Middleware redirects to `/signin?redirect=/protected-route`

2. **User signs in successfully**
   - API returns access token
   - Token stored in localStorage/cookies
   - User redirected to the original protected route (from redirect param)

3. **Page reloads or new visit**
   - Auth context loads user from token
   - Client-side hooks verify access
   - Content renders if authenticated

---

## Token Storage

Currently, tokens are stored in **localStorage**. For better security, migrate to **HttpOnly cookies**:

### Current (Less Secure)
```typescript
localStorage.setItem('access_token', token)
```

### Recommended (More Secure)
```typescript
// Backend: Set HttpOnly cookie
Set-Cookie: access_token=<token>; HttpOnly; Secure; SameSite=Strict

// Frontend: No JavaScript access needed
// Just ensure middleware checks cookies
```

---

## Testing Route Protection

### Test 1: Unauthorized Access
```bash
# Clear auth tokens
localStorage.clear()

# Visit protected route
http://localhost:3000/dashboard

# Expected: Redirected to /signin?redirect=/dashboard
```

### Test 2: Sign-In & Redirect
```bash
1. Visit /dashboard (redirects to /signin?redirect=/dashboard)
2. Sign in with valid credentials
3. Expected: Redirected back to /dashboard
```

### Test 3: Authorized Bypass Prevention
```bash
1. Open DevTools → Application → Cookies
2. Ensure no access_token cookie is set
3. Try to visit /dashboard
4. Expected: Redirects to signin (not blocked by client only)
```

---

## Common Issues & Solutions

### Issue: User can still access protected page without login
**Cause:** Middleware not running or cookies not set

**Solution:**
1. Verify `middleware.ts` exists at root
2. Check that cookies are being set by API:
   ```typescript
   // In signin response, look for Set-Cookie header
   ```
3. Test with incognito/private mode

### Issue: Infinite redirect loop
**Cause:** Auth context not loading properly

**Solution:**
1. Check auth context in DevTools
2. Verify token exists: `localStorage.getItem('access_token')`
3. Test API endpoint: `GET /auth/me` with Authorization header

### Issue: Page flashes before redirect
**Cause:** Client-side redirect happens after render

**Solution:**
- Add loading state in protected component
- Show spinner while `useProtectedRoute()` verifies access

---

## Adding Protection to New Pages

1. Import the protection hook:
   ```tsx
   import { useProtectedRoute } from '@/lib/protected-route'
   ```

2. Call it in your component:
   ```tsx
   export default function NewPage() {
     const { isProtected } = useProtectedRoute()
     
     // Component content...
   }
   ```

3. Add route to `middleware.ts` if needed:
   ```typescript
   const protectedRoutes = [
     // ...existing routes
     '/new-protected-route',
   ]
   ```

---

## Next Steps

1. **Migrate to HttpOnly Cookies** - More secure than localStorage
2. **Add CSRF Protection** - Prevent cross-site request forgery
3. **Implement Rate Limiting** - Prevent brute force attacks
4. **Add Session Expiry** - Auto-logout after inactivity
5. **Update remaining pages** - Add protection to all protected routes
6. **Add audit logging** - Track access attempts and changes

---

## References

- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)
- [OWASP Authentication Best Practices](https://owasp.org/www-community/attacks/Privilege_Escalation)
- [Secure Cookie Handling](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
