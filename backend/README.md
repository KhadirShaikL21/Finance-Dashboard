# Finance Dashboard Backend API

Express.js REST API for the Finance Dashboard application with JWT authentication, role-based access control, and comprehensive input validation.

## 🚀 Quick Start

### Prerequisites

- Node.js 14+
- MongoDB instance
- npm

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Update MONGODB_URI, JWT_SECRET, etc.

# Seed database with test data
node seedData.js

# Start server
npm run dev      # Development with auto-reload
npm start        # Production mode
```

Server runs on `http://localhost:5000`

---

## 📁 Project Structure

```
backend/
├── config/           # Database config
├── controllers/      # Business logic (User, Record, Summary)
├── middleware/       # Auth, role check, rate limiting
├── models/          # Mongoose schemas (User, Record)
├── routes/          # API endpoints (users, records, summary)
├── index.js         # Express app entry point
├── seedData.js      # Database seeding
├── package.json
└── .env            # Environment variables
```

---

## 🔗 API Endpoints

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)

### Records

- `POST /api/records` - Create record (Admin only)
- `GET /api/records` - Get all records (paginated, filterable)
- `GET /api/records/:id` - Get record by ID
- `PUT /api/records/:id` - Update record (Admin only)
- `DELETE /api/records/:id` - Delete record (Admin only)

### Dashboard Summary

- `GET /api/summary/totals` - Total income, expenses, balance
- `GET /api/summary/by-category` - Breakdown by category
- `GET /api/summary/monthly` - Monthly trends
- `GET /api/summary/recent` - Recent transactions
- `GET /api/summary/dashboard` - Complete dashboard data
- `GET /api/summary/analyst-insights` - Advanced analytics (Analyst/Admin only)

---

## 🔐 Key Features

- **JWT Authentication** - Secure token-based auth with 7-day expiry
- **Role-Based Access** - Viewer, Analyst, Admin roles with permissions
- **Input Validation** - Comprehensive field & type validation
- **Rate Limiting** - Tiered protection against API abuse
- **Error Handling** - Detailed error codes and messages
- **Security** - Bcrypt passwords, CORS, helmet.js headers

---

## 💾 Database

### Collections

**Users:** name, email (unique), password (hashed), role, status, timestamps

**Records:** userId, amount, type, category, date, notes, timestamps

### Seed Data

- 5 test users (Admin, Analyst, Viewer, etc.)
- 584 historical financial records (Jan-Mar 2026)
- No future dates (date validation prevents this)

### Test Credentials

```
Admin: admin@example.com / admin123456
Analyst: analyst@example.com / analyst123456
Viewer: viewer@example.com / viewer123456
```

---

## 📊 Validation Rules

### Record Creation

- **amount:** Positive number (> 0)
- **type:** 'income' or 'expense'
- **category:** One of 12 predefined categories
- **date:** YYYY-MM-DD format, cannot be future date
- **notes:** String, max 500 characters

### Status Codes

- 200 OK - Successful request
- 201 Created - Resource created
- 400 Bad Request - Invalid input
- 404 Not Found - Resource not found
- 422 Unprocessable - Validation failed
- 500 Server Error - Unexpected error

---

## 🛡 Security

- **Password:** Hashed with bcryptjs (10 salt rounds)
- **Tokens:** JWT with 7-day expiry
- **Rate Limits:**
  - General: 100/15min
  - Auth: 5/15min (protects login)
  - Write: 30/15min
  - Read: 150/15min
- **Validation:** Model + controller level
- **Future Date Prevention:** Both schema and controller validation

---

## 🧪 Testing

### With cURL

```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}'

# Get records (with token)
curl -X GET http://localhost:5000/api/records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🚀 Deployment

See [../README.md](../README.md) for complete deployment guide including:

- Heroku deployment steps
- Environment setup
- Production checklist

---

**For complete API documentation, see [../README.md](../README.md)**

| View Records | ✅ | ✅ | ✅ |
| View Summaries | ✅ | ✅ | ✅ |
| Create Records | ❌ | ❌ | ✅ |
| Update Records | ❌ | ❌ | ✅ |
| Delete Records | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

## Data Model Examples

### User

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "analyst",
  "status": "active",
  "createdAt": "2026-04-01T10:00:00Z"
}
```

### Financial Record

```json
{
  "id": "uuid",
  "userId": "uuid",
  "amount": 1500.0,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "Monthly salary",
  "createdAt": "2026-04-01T10:00:00Z"
}
```

## Implementation Notes

- Using in-memory storage for simplicity (can be upgraded to SQLite/MongoDB)
- Simple authentication via userId header (can upgrade to JWT tokens)
- All endpoints require authentication
- Role-based access control via middleware

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (permission denied)
- `404` - Not found
- `500` - Server error

## Next Steps (Start Tomorrow)

1. ✅ Set up folder structure
2. ✅ Install dependencies
3. Create `index.js` - Express server setup
4. Create data models (User, Record)
5. Create controllers with business logic
6. Create routes (users, records, summary)
7. Create middleware (auth, role-check)
8. Test all endpoints

Good luck! 🚀
