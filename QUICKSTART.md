# Quick Start Guide - Subscription Management Dashboard

## 🚀 Get Started in 2 Minutes

### Step 1: Install & Run Backend
```bash
cd server
npm install
npm run seed
npm run dev
```
✓ Server running on http://localhost:5000

### Step 2: Install & Run Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
✓ App running on http://localhost:5173

### Step 3: Test It
Open http://localhost:5173 and login with:
- **Email:** user@example.com  
- **Password:** user123

---

## 🎯 Key Features to Try

1. **Browse Plans** → See all available subscription plans
2. **Subscribe** → Subscribe to a plan from the Plans page
3. **View Dashboard** → Check your subscription status
4. **Logout** → Test logout (revokes refresh token)
5. **Admin (optional)** → Login as admin@example.com / admin123 to see admin dashboard

---

## 📚 Documentation

- **README.md** - Full project documentation
- **TESTING.md** - Detailed test scenarios
- **DELIVERY.md** - Features and tech stack overview
- **COMPLETION.md** - Final project summary

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in `server/.env` |
| CORS errors | Verify backend is running on :5000 |
| Database locked | Delete `server/dev.db` and run `npm run seed` |
| Vite port conflict | Change `npm run dev` port (check console output) |

---

## ✅ What's Included

✓ Full-stack application (React + Node.js)  
✓ Secure JWT authentication  
✓ Database with Prisma ORM  
✓ Protected routes & role-based access  
✓ Automatic token refresh  
✓ Responsive UI with TailwindCSS  
✓ Redux state management  
✓ Complete documentation  
✓ Git version control  

---

**Ready to dive in?** Start with Step 1 above! 🎉
