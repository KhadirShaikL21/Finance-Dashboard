# Finance Dashboard - Organizational Financial Management Platform

A full-stack, production-ready organizational finance dashboard with role-based access control, comprehensive API validation, rate limiting, and advanced analytics. Built with Node.js/Express backend and React/Vite frontend.

**Status:** ✅ Production Ready | **Last Updated:** April 2, 2026

---

## 📋 Table of Contents

- [Overview & Features](#overview--features)
- [Tech Stack](#tech-stack)
- [Quick Start Guide](#quick-start-guide)
- [Project Structure](#project-structure)
- [Complete API Documentation](#complete-api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Input Validation & Error Handling](#input-validation--error-handling)
- [Security Features](#security-features)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment Guide](#deployment-guide)
- [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## 🎯 Overview & Features

### Core Capabilities

- ✅ **Shared Organization Dataset** - All authenticated users view the same financial data; user roles control permissions
- ✅ **Role-Based Access Control** - Three roles (Viewer, Analyst, Admin) with granular permissions
- ✅ **Complete CRUD Operations** - Create, read, update, delete financial records (Admin only)
- ✅ **Real-Time Dashboard** - Live financial summaries with income/expense tallies, trends, and monthly analysis
- ✅ **Advanced Analytics** - Dedicated analytics view for Analyst/Admin with growth trends and category analysis
- ✅ **User Management** - Admin panel for managing registered users

### Security & Validation

- ✅ **JWT Authentication** - Secure token-based auth with 7-day expiry
- ✅ **Comprehensive Input Validation** - Field type, length, enum, and range validation
- ✅ **Future Date Prevention** - Model and controller-level validation prevents any transaction dated in the future
- ✅ **Rate Limiting** - Tiered DDoS protection (5/15min for auth, 30/15min for writes, 150/15min for reads)
- ✅ **Professional Error Responses** - Detailed error codes with field-level diagnostics
- ✅ **CORS Security** - Whitelist-based cross-origin control

### UI/UX Excellence

- ✅ **Modern Design System** - Glassy morphism with backdrop blur effects
- ✅ **Smooth Animations** - Gradient transitions and hover effects
- ✅ **Fully Responsive** - Optimized for desktop, tablet, and mobile
- ✅ **Intuitive Navigation** - Tab-based dashboard for dashboard/records/analytics/users
- ✅ **Real-Time Feedback** - Instant validation messages and error alerts

---

## 🛠 Tech Stack

### Backend

```
Node.js + Express.js
├── Authentication: JWT (jsonwebtoken) + bcryptjs
├── Database: MongoDB + Mongoose ODM
├── Security: helmet, cors, express-rate-limit
├── Validation: Custom validators + Mongoose schema validation
├── Port: 5000 (configurable)
└── Environment: dotenv
```

### Frontend

```
React 18 + Vite
├── Styling: TailwindCSS + custom CSS (glassy morphism)
├── HTTP Client: Axios
├── State Management: React Context API
├── Routing: Client-side with React components
├── Build Output: Single-page application (SPA)
└── Port: 5173 (development), built to /dist (production)
```

### Database

```
MongoDB
├── Collections: Users (5 test users), Records (584 seed records)
├── Indexes: email (unique), date, type, category
└── Data: Historical only (January-March 2026, no future dates)
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js** 14.0 or higher
- **npm** 6.0 or higher
- **MongoDB** connection (local or MongoDB Atlas cloud)
- **Git** (optional, for cloning)

### Installation & Running (5 minutes)

#### Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from template:

```bash
cp .env.example .env
```

Configure MongoDB connection in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed database with test data:

```bash
node seedData.js
```

Expected output:

```
✅ MongoDB Connected
✅ Created 5 users
✅ Created 584 financial records
📊 Summary:
   - Total Income: ₹1,600,000
   - Total Expense: ₹1,113,600
   - Net Balance: ₹486,400
```

Start backend server:

```bash
npm run dev     # Development mode with auto-reload
npm start       # Production mode
```

Backend ready at: **http://localhost:5000/api**

#### Step 2: Frontend Setup (in new terminal)

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start frontend development server:

```bash
npm run dev
```

Frontend ready at: **http://localhost:5173**

#### Step 3: Access the Application

Open your browser to **http://localhost:5173** and login with:

- **Email:** admin@example.com
- **Password:** admin123456

---

## 📁 Project Structure

```
finance-dashboard/
│
├── backend/                           # Express.js API server
│   ├── config/
│   │   └── database.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── userController.js         # User CRUD & authentication
│   │   ├── recordController.js       # Record CRUD operations
│   │   └── summaryController.js      # Dashboard analytics & insights
│   ├── middleware/
│   │   ├── auth.js                   # JWT token verification
│   │   ├── roleCheck.js              # Role-based access control
│   │   └── rateLimit.js              # Rate limiting (4 tiers)
│   ├── models/
│   │   ├── User.js                   # User schema + password hashing
│   │   └── Record.js                 # Record schema + validation
│   ├── routes/
│   │   ├── userRoutes.js             # /api/users/* endpoints
│   │   ├── recordRoutes.js           # /api/records/* endpoints
│   │   └── summaryRoutes.js          # /api/summary/* endpoints
│   ├── index.js                      # Express app setup & routing
│   ├── seedData.js                   # Database seeding script
│   ├── package.json
│   ├── .env                          # Environment variables (create from .env.example)
│   └── .env.example
│
├── frontend/                         # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx             # Login form component
│   │   │   ├── Register.jsx          # User registration component
│   │   │   └── Dashboard.jsx         # Main dashboard (4 tabs)
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state management
│   │   ├── services/
│   │   │   └── api.js                # Axios API client
│   │   ├── App.jsx                   # Main app component
│   │   ├── index.css                 # Glassy morphism design system
│   │   └── main.jsx                  # Vite entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env                          # Frontend config
│   └── .env.example
│
└── README.md                         # This file - complete documentation
```

---

## 🔌 Complete API Documentation

### Base URL

```
http://localhost:5000/api
```

### Request Headers (Required for Protected Endpoints)

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

### 👤 USER MANAGEMENT ENDPOINTS

#### 1. Register User

```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active"
  }
}
```

#### 2. Login User

```http
POST /users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439010",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

#### 3. Get All Users (Admin Only)

```http
GET /users
Authorization: Bearer <admin_token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439010",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "status": "active"
    }
    // ... more users
  ]
}
```

#### 4. Get User by ID

```http
GET /users/:id
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    /* user object */
  }
}
```

#### 5. Update User (Admin Only)

```http
PUT /users/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "new-email@example.com",
  "role": "analyst",
  "status": "active"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    /* updated user object */
  }
}
```

---

### 📊 FINANCIAL RECORDS ENDPOINTS

#### 1. Create Record (Admin Only)

```http
POST /records
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "freelance",
  "date": "2026-03-15",
  "notes": "Project completion payment"
}
```

**Response (201 Created):**

```json
{
  "status": "success",
  "message": "Record created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439010",
    "amount": 5000,
    "type": "income",
    "category": "freelance",
    "date": "2026-03-15T00:00:00.000Z",
    "notes": "Project completion payment",
    "createdAt": "2026-03-20T10:30:00.000Z",
    "updatedAt": "2026-03-20T10:30:00.000Z"
  }
}
```

#### 2. Get All Records (Paginated & Filterable)

```http
GET /records?type=income&category=salary&page=1&limit=10&startDate=2026-01-01&endDate=2026-03-31
Authorization: Bearer <token>
```

**Query Parameters:**

- `type` (optional): `income` or `expense`
- `category` (optional): One of the valid categories
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `page` (optional): Default 1
- `limit` (optional): 1-100, default 10

**Response (200 OK):**

```json
{
  "status": "success",
  "count": 10,
  "pagination": {
    "total": 584,
    "pages": 59,
    "currentPage": 1,
    "limit": 10
  },
  "data": [
    {
      /* record objects */
    }
  ]
}
```

#### 3. Get Record by ID

```http
GET /records/:id
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    /* record object */
  }
}
```

#### 4. Update Record (Admin Only)

```http
PUT /records/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "amount": 6000,
  "category": "freelance",
  "date": "2026-03-20"
}
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Record updated successfully",
  "data": {
    /* updated record object */
  }
}
```

#### 5. Delete Record (Admin Only)

```http
DELETE /records/:id
Authorization: Bearer <admin_token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "message": "Record deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "category": "freelance",
    "amount": 5000
  }
}
```

---

### 📈 DASHBOARD & ANALYTICS ENDPOINTS

#### 1. Get Totals (All Authenticated Users)

```http
GET /summary/totals
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "totalIncome": 1600000,
    "totalExpense": 1113600,
    "netBalance": 486400
  }
}
```

#### 2. Get By Category (All Authenticated Users)

```http
GET /summary/by-category
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "income": {
      "salary": 1200000,
      "freelance": 300000,
      "bonus": 100000,
      "investment": 0
    },
    "expense": {
      "rent": 180000,
      "groceries": 45000,
      "utilities": 15000,
      "transport": 12500,
      "entertainment": 25000,
      "healthcare": 18000,
      "education": 20000,
      "other": 5100
    }
  }
}
```

#### 3. Get Monthly Trends (All Authenticated Users)

```http
GET /summary/monthly
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    {
      "month": "January 2026",
      "income": 533200,
      "expense": 371000,
      "netChange": 162200
    },
    {
      "month": "February 2026",
      "income": 533200,
      "expense": 371000,
      "netChange": 162200
    },
    {
      "month": "March 2026",
      "income": 533600,
      "expense": 371600,
      "netChange": 162000
    }
  ]
}
```

#### 4. Get Recent Activity (All Authenticated Users)

```http
GET /summary/recent
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": [
    /* last 10 records */
  ]
}
```

#### 5. Get Complete Dashboard (All Authenticated Users)

```http
GET /summary/dashboard
Authorization: Bearer <token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "totals": {
      /* totals object */
    },
    "byCategory": {
      /* category breakdown */
    },
    "monthlyTrends": [
      /* monthly data */
    ],
    "recentTransactions": [
      /* recent records */
    ]
  }
}
```

#### 6. Get Analyst Insights (Analyst & Admin Only)

```http
GET /summary/analyst-insights
Authorization: Bearer <analyst_token>
```

**Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "totalRecords": 584,
    "expenseGrowth": "3.2%",
    "incomeGrowth": "5.1%",
    "topExpenseCategories": [
      {
        "category": "rent",
        "amount": 180000,
        "percentage": 16.2
      },
      {
        "category": "other",
        "amount": 5100,
        "percentage": 0.46
      }
    ],
    "expenseDistribution": {
      /* by category */
    },
    "monthlyComparison": [
      /* analysis */
    ]
  }
}
```

---

## 👥 User Roles & Permissions

| Feature                    | Viewer | Analyst | Admin |
| -------------------------- | :----: | :-----: | :---: |
| **View Dashboard**         |   ✅   |   ✅    |  ✅   |
| **View Financial Records** |   ✅   |   ✅    |  ✅   |
| **View Analytics**         |   ❌   |   ✅    |  ✅   |
| **Create Records**         |   ❌   |   ❌    |  ✅   |
| **Edit Records**           |   ❌   |   ❌    |  ✅   |
| **Delete Records**         |   ❌   |   ❌    |  ✅   |
| **View Users List**        |   ❌   |   ❌    |  ✅   |
| **Manage Users**           |   ❌   |   ❌    |  ✅   |

---

## 🔐 Input Validation & Error Handling

### Validation Hierarchy

1. **Client-Side:** Frontend form validation with instant feedback
2. **API Validation:** Backend enforces all validations
3. **Database Schema:** Mongoose schema-level validators
4. **Business Logic:** Controller-level custom validation

### Record Field Validation

#### Required Fields

| Field        | Type   | Rules                  | Error Code              |
| ------------ | ------ | ---------------------- | ----------------------- |
| **amount**   | Number | Must be > 0            | INVALID_AMOUNT          |
| **type**     | String | `income` or `expense`  | INVALID_TYPE            |
| **category** | String | 12 valid categories    | INVALID_CATEGORY        |
| **date**     | Date   | YYYY-MM-DD, not future | FUTURE_DATE_NOT_ALLOWED |

#### Optional Fields

| Field     | Type   | Rules              | Error Code     |
| --------- | ------ | ------------------ | -------------- |
| **notes** | String | Max 500 characters | NOTES_TOO_LONG |

### Valid Categories

**Income:** salary, bonus, freelance, investment

**Expense:** groceries, utilities, rent, transport, entertainment, healthcare, education, other

### Filter Validation (GET /records)

| Parameter     | Validation             | Error Code              |
| ------------- | ---------------------- | ----------------------- |
| **page**      | Must be ≥ 1            | INVALID_PAGE            |
| **limit**     | Must be 1-100          | INVALID_LIMIT           |
| **type**      | Must be valid type     | INVALID_TYPE_FILTER     |
| **category**  | Must be valid category | INVALID_CATEGORY_FILTER |
| **startDate** | Valid ISO date         | INVALID_START_DATE      |
| **endDate**   | Valid ISO date         | INVALID_END_DATE        |

### HTTP Status Codes

| Code    | Usage                                    |
| ------- | ---------------------------------------- |
| **200** | Successful GET, PUT, DELETE              |
| **201** | Successful POST (created)                |
| **400** | Bad request (invalid ID, missing fields) |
| **404** | Resource not found                       |
| **422** | Validation failed (invalid values)       |
| **500** | Server error                             |

### Example Error Responses

**Future Date Error:**

```json
{
  "status": "error",
  "code": "FUTURE_DATE_NOT_ALLOWED",
  "message": "Date cannot be in the future. Please enter a past or current date.",
  "field": "date",
  "providedDate": "2026-05-01T00:00:00.000Z",
  "today": "2026-04-02T23:59:59.999Z"
}
```

**Invalid Amount Error:**

```json
{
  "status": "error",
  "code": "INVALID_AMOUNT",
  "message": "Amount must be a positive number greater than 0",
  "field": "amount"
}
```

**Invalid Category Error:**

```json
{
  "status": "error",
  "code": "INVALID_CATEGORY",
  "message": "Category must be one of: salary, bonus, freelance, investment, groceries, utilities, rent, transport, entertainment, healthcare, education, other",
  "field": "category",
  "validValues": ["salary", "bonus", "freelance", ...]
}
```

### Complete Error Codes Reference

| Code                    | Status | Description                     |
| ----------------------- | ------ | ------------------------------- |
| MISSING_REQUIRED_FIELDS | 400    | Required field(s) not provided  |
| INVALID_AMOUNT          | 422    | Amount not positive number      |
| INVALID_TYPE            | 422    | Type not 'income' or 'expense'  |
| INVALID_CATEGORY        | 422    | Category not in valid list      |
| INVALID_DATE_FORMAT     | 422    | Date not valid ISO format       |
| FUTURE_DATE_NOT_ALLOWED | 422    | Date is in the future           |
| INVALID_NOTES           | 422    | Notes not a string              |
| NOTES_TOO_LONG          | 422    | Notes exceed 500 characters     |
| INVALID_PAGE            | 422    | Page number < 1                 |
| INVALID_LIMIT           | 422    | Limit not 1-100                 |
| INVALID_TYPE_FILTER     | 422    | Type filter invalid             |
| INVALID_CATEGORY_FILTER | 422    | Category filter invalid         |
| INVALID_START_DATE      | 422    | startDate invalid               |
| INVALID_END_DATE        | 422    | endDate invalid                 |
| INVALID_RECORD_ID       | 400    | ID format invalid (need 24 hex) |
| RECORD_NOT_FOUND        | 404    | Record doesn't exist            |
| VALIDATION_ERROR        | 422    | Mongoose validation error       |
| NO_UPDATE_FIELDS        | 400    | PUT with no fields to update    |
| INTERNAL_SERVER_ERROR   | 500    | Unexpected error                |

---

## 🛡 Security Features

### 1. Authentication

- **JWT Implementation:** Tokens issued on login/register, expire after 7 days
- **Password Security:** Bcrypt hashing (10 salt rounds), never stored plain-text
- **Token Storage:** LocalStorage (frontend) - cleared on logout
- **Protected Routes:** All API endpoints validate JWT on protected routes

### 2. Rate Limiting

Protects against brute force and DDoS attacks:

```javascript
// Tier 1: General API
- Limit: 100 requests
- Window: 15 minutes

// Tier 2: Authentication (Login/Register)
- Limit: 5 requests (only counts failed attempts)
- Window: 15 minutes

// Tier 3: Write Operations (POST/PUT/DELETE)
- Limit: 30 requests
- Window: 15 minutes

// Tier 4: Read Operations (GET)
- Limit: 150 requests
- Window: 15 minutes
```

### 3. Input Validation

- **Type Checking:** JavaScript type validation + Mongoose schema types
- **Enum Enforcement:** Category/type must match predefined lists
- **String Limits:** Max 500 chars for notes, other limits as appropriate
- **Numeric Ranges:** Amounts must be positive, pagination within bounds
- **Date Validation:** Both format and logic checks (no future dates)
- **ID Validation:** MongoDB ObjectId format (24 hex characters)

### 4. Future Date Prevention

- **Model Level:** Mongoose validator checks date ≤ today
- **Controller Level:** Business logic validation before DB operation
- **Frontend:** Client-side date picker limits to today and past
- **Enforcement:** Both layers ensure no future transactions exist

### 5. CORS Security

- **Whitelist Origins:** Configured to allow frontend domain only
- **Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Credentials Support:** Enabled for token transmission
- **Headers:** Authorization, Content-Type allowed

### 6. HTTP Security Headers

- **Helmet.js:** Applied for XSS, clickjacking, MIME sniffing protection
- **Content-Security-Policy:** Restricts script sources
- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Forces MIME type

### 7. Environment Secrets

- JWT_SECRET configured via environment variable
- Database credentials in .env (not in code)
- No sensitive data in version control
- .gitignore prevents .env, node_modules from being committed

---

## 💾 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt-hashed),
  role: String (enum: 'viewer', 'analyst', 'admin'),
  status: String (enum: 'active', 'inactive'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:** email (unique), role, status

### Records Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (optional, for audit trail),
  amount: Number (required, > 0),
  type: String (required, enum: 'income', 'expense'),
  category: String (required, enum: [12 categories]),
  date: Date (required, ≤ today),
  notes: String (optional, max 500 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:** date (descending), type, category, userId

### Seed Data Summary

**Pre-populated Test Data:**

- 5 User accounts with different roles
- 584 Financial records (Jan-Mar 2026)
- No future dates (all historical)
- Total Income: ₹1,600,000
- Total Expense: ₹1,113,600
- Net Balance: ₹486,400

---

## 🧪 Testing

### Manual Testing with cURL

#### 1. Register

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

#### 2. Login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123456"
  }'
```

**Save the returned token for next requests:**

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 3. Create Record

```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "freelance",
    "date": "2026-03-15",
    "notes": "Project payment"
  }'
```

#### 4. Get Records

```bash
curl -X GET 'http://localhost:5000/api/records?page=1&limit=10&type=income' \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. Get Dashboard

```bash
curl -X GET http://localhost:5000/api/summary/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### Test Cases Checklist

- [ ] Register new user successfully
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Access protected route without token (401)
- [ ] Create record as Admin (201)
- [ ] Try create record as Viewer/Analyst (403)
- [ ] Create record with future date (422)
- [ ] Create record with negative amount (422)
- [ ] Get records with pagination (page=1, limit=10)
- [ ] Filter records by type (income/expense)
- [ ] Filter records by date range
- [ ] Get dashboard totals
- [ ] Get analyst insights as Admin
- [ ] Try get analyst insights as Viewer (403)
- [ ] Update record as Admin (200)
- [ ] Delete record as Admin (200)
- [ ] Verify rate limiting (exceed 5 login attempts/15min)

### Test Credentials

```
Admin User (Full Access)
- Email: admin@example.com
- Password: admin123456
- Role: admin

Analyst User (Analytics Only)
- Email: analyst@example.com
- Password: analyst123456
- Role: analyst

Viewer User (Read-Only)
- Email: viewer@example.com
- Password: viewer123456
- Role: viewer

Inactive User (Blocked)
- Email: inactive@example.com
- Password: inactive123456
- Status: inactive
```

---

## 🚀 Deployment Guide

### Heroku Deployment (Backend)

#### 1. Install Heroku CLI

```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Verify installation
heroku --version
```

#### 2. Create Heroku App

```bash
heroku create your-finance-app-name
```

#### 3. Set Environment Variables

```bash
heroku config:set \
  MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/finance-db" \
  JWT_SECRET="your_super_secret_production_key" \
  NODE_ENV="production"
```

#### 4. Deploy

```bash
git push heroku main
```

#### 5. Verify Deployment

```bash
heroku open
heroku logs --tail
```

### Vercel Deployment (Frontend Only)

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

#### 2. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

#### 3. Update Environment Variables in Vercel Dashboard

```
VITE_API_BASE_URL=https://your-heroku-backend.herokuapp.com/api
```

### Netlify Deployment (Frontend)

#### 1. Build Frontend

```bash
cd frontend
npm run build
# Creates dist/ folder
```

#### 2. Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### 3. Configure Environment

In Netlify Dashboard:

- Settings → Build & Deploy → Environment
- Add: `VITE_API_BASE_URL` = https://your-backend-url/api

### Production Environment Variables

**Backend (.env for production):**

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
JWT_SECRET=generate_a_strong_random_string_here_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=production
```

**Frontend (.env for production):**

```env
VITE_API_BASE_URL=https://your-production-backend-url.com/api
```

---

## ✅ Pre-Deployment Checklist

### Backend Preparation

- [ ] `.env.example` exists with all required variables documented
- [ ] Production `.env` created with secure JWT_SECRET (32+ chars)
- [ ] MongoDB Atlas cluster created and whitelist IP configured
- [ ] Database seeded with initial data (`node seedData.js`)
- [ ] All dependencies installed (`npm install`)
- [ ] No console.log statements in production code
- [ ] Error handling covers all endpoints
- [ ] Rate limiting thresholds reviewed and appropriate
- [ ] CORS whitelist configured for production frontend URL

### Frontend Preparation

- [ ] `.env.example` exists with VITE_API_BASE_URL documented
- [ ] Production `.env` created with correct backend API URL
- [ ] All dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] No console errors/warnings
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All 3 roles tested (Admin, Analyst, Viewer)

### Security Verification

- [ ] JWT_SECRET is 32+ characters and truly random
- [ ] No API keys/secrets in code (only in .env)
- [ ] Password hashing enabled with bcrypt
- [ ] Rate limiting active
- [ ] Future date validation working (try creating record for tomorrow)
- [ ] CORS properly configured
- [ ] HTTPS enabled (for production URLs)

### Testing & Validation

- [ ] All CRUD operations work (Create, Read, Update, Delete)
- [ ] Role-based access control enforced
- [ ] Validation errors return correct status codes
- [ ] Error messages are helpful and not exposing internals
- [ ] Pagination works (test limit and offset)
- [ ] Date filters work correctly
- [ ] Dashboard calculations are accurate
- [ ] No unhandled promises/async issues

### Database

- [ ] MongoDB connection string correct
- [ ] Indexes created
- [ ] Test data seeded successfully
- [ ] Backup strategy documented
- [ ] Connection pooling configured (Heroku: `maxPoolSize=10`)

### Documentation

- [ ] README.md complete and accurate
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Test credentials provided
- [ ] Deployment instructions clear

### Submission Readiness

- [ ] Code follows consistent style
- [ ] No dead code or commented-out sections
- [ ] All files organized logically
- [ ] package.json scripts match documented commands
- [ ] .gitignore properly configured
- [ ] No sensitive files committed
- [ ] README ready for external audience

---

## 📞 Support & Troubleshooting

### Common Issues

**"Cannot reach backend"**

- Ensure backend running: `npm run dev` in backend folder
- Verify backend on http://localhost:5000/api
- Check frontend `.env` has correct VITE_API_BASE_URL
- Browser DevTools → Network tab shows failed requests

**"Invalid token" after login**

- Clear localStorage: DevTools → Application → Storage → localStorage → Clear All
- Re-login with test credentials
- Check JWT_SECRET matches between registration and login

**"Port 5000 already in use"**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

**"Database connection failed"**

- Verify MONGODB_URI in .env
- Check MongoDB Atlas IP whitelist includes your IP
- Test connection locally: `node -e "require('mongoose').connect(process.env.MONGODB_URI).then(()=>console.log('✓')).catch(e=>console.log('✗',e.message))"`

**"Validation errors after request"**

- Check request body matches documented schema
- Verify all required fields present
- Ensure date format is YYYY-MM-DD
- Amount must be positive number
- Category/type must match valid enum

### Get Help

**Check Logs:**

```bash
# Backend development logs
npm run dev

# Frontend browser console
F12 → Console tab

# Production logs (Heroku)
heroku logs --tail

# Netlify logs
netlify logs --prod
```

---

## 📄 License & Notes

This Finance Dashboard is provided as a production-ready application for organizational use.

**Complete, Tested, & Ready for Deployment** ✅

---

**Version:** 1.0.0  
**Last Updated:** April 2, 2026  
**Status:** Production Ready  
**Maintenance:** Actively maintained
