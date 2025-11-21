# Subscription Management Dashboard

A full-stack SaaS subscription management system built with React.js, Node.js/Express, and Prisma ORM.

## Project Overview

This mini SaaS admin dashboard allows users to:
- Register and login with JWT authentication
- View and subscribe to available plans
- View their active subscription details
- Admins can view all subscriptions across users

## Tech Stack

### Frontend
- **React.js** (Vite)
- **TypeScript**
- **TailwindCSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for HTTP requests

### Backend
- **Node.js** with **Express.js**
- **Prisma ORM** for database management
- **SQLite** (development) / **PostgreSQL/MongoDB** (production ready)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Project Structure

```
subscription-dashboard-task/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── pages/            # Login, Register, Plans, Dashboard, AdminSubscriptions
│   │   ├── components/       # Navbar, ProtectedRoute
│   │   ├── store/            # Redux store, slices (auth, subscription)
│   │   ├── App.tsx           # Main app with routing
│   │   └── index.css         # Tailwind styles
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── routes/           # auth.js, plans.js, subscriptions.js
│   │   ├── middleware/       # auth.js (JWT verification, role-based access)
│   │   ├── utils/            # jwt.js (token generation/verification)
│   │   └── index.js          # Express app initialization
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.js           # Seeding script
│   ├── .env                  # Environment variables
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 20+ 
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/ggshankar61096-ai/subscription-dashboard-task
cd subscription-dashboard-task
```

### 2. Setup Backend

```bash
cd server
npm install
npm run seed
npm run dev
```

The backend will run on `http://localhost:5000`.

**Default Test Accounts:**
- **Admin:** admin@example.com / admin123
- **User:** gowtham123@gmail.com / Gowtham123

### 3. Setup Frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user, returns JWT tokens

### Plans
- `GET /api/plans` - Get all available subscription plans

### Subscriptions
- `POST /api/subscribe/:planId` - Subscribe to a plan (requires authentication)
- `GET /api/my-subscription` - Get user's active subscription (requires authentication)
- `GET /api/admin/subscriptions` - Get all subscriptions (admin only)

## Features

✅ **Authentication & Authorization**
- JWT-based authentication with access and refresh tokens
- Role-based access control (admin vs. user)
- Secure token storage in localStorage

✅ **Subscription Management**
- Browse available plans
- Subscribe to plans
- View active subscriptions
- Track subscription status (active/expired)

✅ **Admin Features**
- View all user subscriptions
- Monitor subscription status across the platform

✅ **UI/UX**
- Responsive design with TailwindCSS
- Navigation bar with user menu
- Protected routes
- Clean, professional layout
- Loading states and error handling

## Database Schema

### Users
- id (PK)
- name
- email (unique)
- password (hashed)
- role (admin/user)
- createdAt, updatedAt

### Plans
- id (PK)
- name
- price
- features (JSON array)
- duration (in days)
- createdAt, updatedAt

### Subscriptions
- id (PK)
- userId (FK)
- planId (FK)
- startDate
- endDate
- status (active/expired/cancelled)
- createdAt, updatedAt

## Environment Variables

### Server (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=5000
```

### Client
The frontend connects to the backend via the API_URL defined in each page component (http://localhost:5000/api).

## Scripts

### Backend
```bash
npm run dev     # Start development server
npm run build   # Build TypeScript
npm run seed    # Seed database with sample data
```

### Frontend
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Optional Features (Future Enhancements)

- 🎨 Dark/Light theme toggle
- 💳 Stripe/Razorpay payment integration
- 📊 Enhanced analytics dashboard
- 🔄 Plan upgrade/downgrade logic
- 📧 Email notifications
- 🚀 Deployment to Vercel (frontend) & Render/Railway (backend)

## Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Render/Railway)
Push to GitHub, connect repository, and deploy with environment variables set.

## Author

**Your Name**
- Name: Gowrishankar G
- Email: gowthamshankar610@gmail.com
- GitHub: [@gowrishankar](https://github.com/ggshankar61096-ai/subscription-dashboard-task)


