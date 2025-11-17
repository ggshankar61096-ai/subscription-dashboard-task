# Testing Guide

This document provides step-by-step instructions to test all features of the Subscription Management Dashboard.

## Prerequisites

Both servers must be running:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Frontend should be accessible at `http://localhost:5173`
Backend should be accessible at `http://localhost:5000`

## Test Accounts

The database comes pre-seeded with test accounts:

### Admin Account
- **Email:** admin@example.com
- **Password:** admin123
- **Role:** Admin

### Regular User Account
- **Email:** user@example.com
- **Password:** user123
- **Role:** User

## Test Scenarios

### 1. Authentication Flow

#### 1.1 User Registration
1. Navigate to `http://localhost:5173/register`
2. Fill in the form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Register"
4. Expected: User should be redirected to `/dashboard` and logged in

#### 1.2 User Login
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: user@example.com
   - Password: user123
3. Click "Login"
4. Expected: User should be redirected to `/dashboard`

#### 1.3 Logout
1. From any authenticated page, click the "Logout" button in the navbar
2. Expected: User should be redirected to `/login` and localStorage should be cleared

### 2. Plans Page

#### 2.1 View Plans (Unauthenticated)
1. Navigate to `http://localhost:5173/plans`
2. Expected: See 3 plans displayed (Basic, Professional, Enterprise) with:
   - Plan name
   - Monthly price
   - List of features
   - "Subscribe" button

#### 2.2 Subscribe to Plan (Authenticated)
1. Login as user@example.com
2. Navigate to `/plans`
3. Click "Subscribe" on any plan
4. Expected: Success message appears "Subscribed successfully!"

#### 2.3 Subscribe Error (Already Subscribed)
1. Try to subscribe again while already subscribed
2. Expected: Error message "User already has an active subscription"

### 3. Dashboard Page

#### 3.1 View User Profile
1. Login as user@example.com
2. Navigate to `/dashboard`
3. Expected: See user information:
   - Name: John Doe
   - Email: user@example.com
   - Role: user

#### 3.2 View Subscription (Active)
1. Login as user@example.com
2. Navigate to `/dashboard`
3. If user has an active subscription:
   - Expected: See subscription details:
     - Status: "active" (in green)
     - Start Date
     - End Date

#### 3.3 No Subscription
1. Login as a newly registered user
2. Navigate to `/dashboard`
3. Expected: "No active subscription. Browse plans" link

### 4. Admin Dashboard

#### 4.1 Access Admin Page
1. Login as admin@example.com
2. Expected: Navbar shows "Admin" link instead of "Dashboard"
3. Click "Admin" in navbar
4. Expected: Navigate to `/admin/subscriptions`

#### 4.2 View All Subscriptions
1. From admin page, view the subscriptions table
2. Expected: Table shows all user subscriptions with columns:
   - User Name
   - Plan Name
   - Status (color-coded)
   - Start Date
   - End Date

#### 4.3 Unauthorized Access (User to Admin)
1. Login as user@example.com
2. Try to access `/admin/subscriptions` directly in URL
3. Expected: Redirected to `/dashboard` (ProtectedRoute prevents access)

### 5. Route Protection

#### 5.1 Unauthenticated User
1. Clear localStorage or use incognito window
2. Try to access `/dashboard`
3. Expected: Redirected to `/login`

#### 5.2 Role-Based Access
1. Login as regular user
2. Try to access `/admin/subscriptions`
3. Expected: Redirected to `/dashboard`

### 6. API Testing (Optional - using curl or Postman)

#### Register API
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123"}'
```

#### Login API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}'
```

#### Get Plans
```bash
curl http://localhost:5000/api/plans
```

#### Subscribe (requires token)
```bash
curl -X POST http://localhost:5000/api/subscribe/:planId \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get My Subscription
```bash
curl http://localhost:5000/api/my-subscription \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Admin Subscriptions
```bash
curl http://localhost:5000/api/admin/subscriptions \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Troubleshooting

### Backend not running?
- Check if port 5000 is available
- Verify .env file is configured correctly
- Run `npm run seed` to ensure database is populated

### Frontend not connecting to backend?
- Verify both servers are running
- Check CORS is enabled in server
- Verify API URL in frontend components is correct (http://localhost:5000/api)

### Token expired?
- Tokens are set to expire in 15 minutes
- Refresh token automatically when needed (optional feature)

### Database issues?
- Delete `server/dev.db` and run `npm run seed` again to reset
- Verify Prisma migrations are applied: `npx prisma migrate dev`

## Success Checklist

- ✅ Can register new user
- ✅ Can login with existing account
- ✅ Can view plans list
- ✅ Can subscribe to a plan
- ✅ Can view active subscription in dashboard
- ✅ Admin can view all subscriptions
- ✅ Protected routes redirect unauthenticated users
- ✅ Role-based access control works
- ✅ Logout clears tokens and redirects
- ✅ Navbar displays appropriate links based on auth status and role
