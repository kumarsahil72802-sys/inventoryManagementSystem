# Inventory Management System

A comprehensive full-stack inventory management system built with modern web technologies. This application provides complete inventory tracking, sales management, purchase orders, financial reporting, and administrative controls.

**Status**: 85% Production Ready | Last Updated: April 16, 2026 | [Security Audit](audit_report.md)

---

## 🚨 CRITICAL SECURITY NOTICE

⚠️ **Before deploying to production, you MUST fix critical security issues:**

1. **Exposed Credentials**: `.env` file contains hardcoded database/API credentials
   - Action: See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md#-critical-issues-fix-immediately)
   - Time: 15 minutes

2. **Hardcoded Admin Password**: Default password "admin" in `reset_admin.js`
   - Action: See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md#2-hardcoded-default-admin-password)
   - Time: 10 minutes

3. **Missing Input Validation**: No express-validator middleware
   - Action: See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md#3-missing-input-validation--sanitization)
   - Time: 30 minutes

4. **No Rate Limiting**: Vulnerable to brute-force attacks
   - Action: See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md#4-missing-rate-limiting)
   - Time: 15 minutes

**See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) for complete security checklist and fixes.**

---

## 🏗️ Project Overview

This is a comprehensive inventory management system designed for businesses to efficiently track their inventory, manage sales and purchases, handle financial operations, and generate insightful reports. The system features enterprise-level architecture with modern security practices and production-ready deployment options.

### ✅ Completed Features (98%)
- **Admin Authentication**: Secure login system with JWT tokens (7-day expiry)
- **Executive Dashboard**: Real-time KPIs and analytics (Orders, Sales, Purchases, Revenue, Profit)
- **Staff Management**: Full CRUD with document uploads to Cloudinary
- **Inventory Management**: Categories, items, batch tracking, HSN/SAC codes
- **Warehouse Management**: Multi-location support with bin/rack tracking
- **Stock Management**: Real-time tracking with automated deductions on sales/purchases
- **Sales Orders**: Complete management with order tracking and delivery
- **Purchase Orders**: Complete management with goods receipt notes
- **Supplier Management**: Full supplier database and CRUD operations
- **Customer Management**: CRM features with customer relationships
- **Invoicing System**: Backend API complete, frontend integration ready
- **Finance Module**: Income/expense tracking with warehouse analytics
- **Reporting**: Dashboard analytics, stock aging, valuation reports
- **Damage Tracking**: Record tracking and write-offs
- **Advanced Features**: Real-time stock deductions, multi-warehouse transfers, batch tracking

### 🚧 In Development
- **Advanced Analytics**: Predictive stock analysis
- **Mobile App**: React Native companion app

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js 5.x
- **Database**: MongoDB with Mongoose 8.x ODM
- **Authentication**: JWT (JSON Web Tokens) with 7-day expiry + bcryptjs (10 salt rounds)
- **File Storage**: Cloudinary for secure document uploads
- **Security**: CORS, helmet.js (headers), rate limiting (ready to implement)
- **Validation**: Custom validation helpers (express-validator recommended)
- **Additional**: Compression middleware, body-parser, dotenv

### Frontend
- **Framework**: Next.js 15 with React 19 (app router)
- **UI Components**: Material-UI (MUI) 7.x
- **Styling**: Tailwind CSS 4.x with PostCSS
- **HTTP Client**: Axios with request/response interceptors
- **Data Visualization**: Recharts for analytics
- **PDF Generation**: jsPDF with autotable
- **Icon Library**: Tabler Icons

### Development & DevOps
- **Version Control**: Git
- **Package Management**: npm
- **Code Quality**: ESLint (frontend configured, backend needs setup)
- **CI/CD**: GitHub Actions (workflow template provided)
- **Testing**: Jest + Supertest (recommended, not yet implemented)
- **Deployment**: Vercel (frontend), Render/Railway (backend), MongoDB Atlas (database)

## 📁 Project Structure

```
inventory_management/
├── README.md                       # This file
├── PRODUCTION_READINESS.md         # ⚠️ Security fixes & enhancements
├── FREE_DEPLOYMENT_GUIDE.md        # Complete free deployment guide
├── SECURITY.md                     # Security guidelines
├── audit_report.md                 # Detailed system audit
│
├── inventory_backend/
│   └── Inventory_Backend/
│       ├── index.js                # Main Express server entry point
│       ├── package.json            # Dependencies (Node.js 16+)
│       ├── reset_admin.js          # ⚠️ Admin reset utility (has hardcoded password)
│       ├── .env.example            # Environment variables template
│       ├── .env                    # ⚠️ NEVER commit this - contains credentials
│       ├── .gitignore              # Git exclusions (.env included ✓)
│       ├── src/
│       │   ├── config/
│       │   │   └── cloudinary.js   # Cloudinary configuration
│       │   ├── controllers/        # Business logic (18 modules)
│       │   ├── middleware/
│       │   │   ├── auth.js         # JWT verification middleware
│       │   │   └── staffUpload.js  # File upload to Cloudinary
│       │   ├── models/             # Mongoose schemas (15 models)
│       │   ├── routes/
│       │   │   └── routes.js       # All API endpoint definitions
│       │   ├── db/
│       │   │   └── mongo-db-connect.js # MongoDB connection setup
│       │   ├── seedData/           # Database seeding scripts
│       │   └── utils/              # Helper functions
│       └── README.md
│
└── inventory_frontend/
    └── Inventory_Frontend/
        ├── package.json            # Dependencies (Node.js 18+)
        ├── next.config.mjs         # Next.js configuration
        ├── .env.local              # Frontend environment variables (dev)
        ├── .env.example            # Template for .env.local
        ├── .gitignore              # Git exclusions
        ├── eslint.config.mjs       # ESLint configuration
        ├── tsconfig.json           # TypeScript config (if needed)
        ├── postcss.config.mjs       # PostCSS/Tailwind config
        ├── public/                 # Static assets
        └── src/
            ├── app/                # Next.js App Router pages
            ├── components/         # Reusable React components
            ├── context/            # React Context providers
            │   └── AuthContext.js  # Authentication context
            ├── lib/                # Utilities and API clients
            └── styles/             # Global styles
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher
- **MongoDB**: Local instance OR MongoDB Atlas cloud account
- **Git**: For version control
- **Cloudinary Account**: For file uploads (optional for development)

### 1️⃣ Backend Setup (Local Development)

```bash
# Navigate to backend
cd inventory_backend/Inventory_Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Generate secure JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste in .env JWT_SECRET field

# Update .env with your credentials
# - MONGO_URI: MongoDB connection string
# - JWT_SECRET: Paste generated secret
# - CLOUDINARY_*: Optional for development

# Start backend server
npm start
# Server runs at: http://localhost:8000
```

**Environment Variables Required:**
```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your-generated-32-byte-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ALLOWED_ORIGINS=http://localhost:3000
```

### 2️⃣ Frontend Setup (Local Development)

```bash
# Navigate to frontend
cd inventory_frontend/Inventory_Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start frontend development server
npm run dev
# Application available at: http://localhost:3000
```

**Environment Variables Required:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3️⃣ Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod

# Verify connection
mongosh "mongodb://localhost:27017"
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create M0 free cluster
3. Create database user (username: `kumarsahil72802_db_user`)
4. Whitelist your IP (or 0.0.0.0/0 for development)
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/inventory_db`
6. Update `.env` with connection string

### 4️⃣ Initial Admin User

```bash
# From backend directory
node reset_admin.js

# Login credentials:
# Email: admin@inventory.com
# Password: admin (⚠️ Change immediately after first login)
```

---

## 🔐 Security Setup (Important)

### For Development:
✅ Basic security implemented
- JWT authentication
- Password hashing with bcryptjs
- CORS configuration
- Environment variable protection

### For Production:
⚠️ **REQUIRED** Additional setup:
See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md#-critical-issues-fix-immediately):

1. **Rotate all credentials** (database, JWT_SECRET, API keys)
2. **Fix hardcoded passwords** in reset_admin.js
3. **Implement input validation** with express-validator
4. **Add rate limiting** to prevent brute-force attacks
5. **Enable HTTPS/SSL** (auto with Vercel/Render)
6. **Add security headers** with helmet.js
7. **Enable XSS/Injection protection**
8. **Implement request logging** with morgan

---

## 📡 API Documentation

Complete API endpoints are defined in [src/routes/routes.js](inventory_backend/Inventory_Backend/src/routes/routes.js)

### Authentication
```
POST   /api/auth/admin/login          # Login and get JWT token
```

### Staff Management
```
GET    /api/staff                     # Get all staff (paginated)
POST   /api/staff                     # Create new staff member
GET    /api/staff/:id                 # Get staff by ID
PUT    /api/staff/:id                 # Update staff member
DELETE /api/staff/:id                 # Delete staff member
GET    /api/staff/download-document   # Download staff document
```

### Inventory Management
```
GET    /api/items                     # Get all items
POST   /api/items                     # Create item
GET    /api/items/:id                 # Get item by ID
PUT    /api/items/:id                 # Update item
DELETE /api/items/:id                 # Delete item
GET    /api/categories                # Get all categories
POST   /api/categories                # Create category
GET    /api/warehouses                # Get all warehouses
POST   /api/warehouses                # Create warehouse
```

### Stock Management
```
GET    /api/stock/real-time           # Get real-time stock levels
POST   /api/stock/real-time           # Create stock entry
GET    /api/stock/transactions        # Get stock transactions
GET    /api/stock/transfers           # Get stock transfers
```

### Sales & Purchase
```
GET    /api/sales/orders              # Get all sales orders
POST   /api/sales/orders              # Create sales order
GET    /api/purchase/orders           # Get all purchase orders
POST   /api/purchase/orders           # Create purchase order
```

### Analytics & Reports
```
GET    /api/dashboard                 # Dashboard analytics data
GET    /api/reports/stock-summary     # Stock summary report
GET    /api/reports/item-sales        # Item-wise sales report
GET    /api/reports/valuation         # Inventory valuation report
```

**Note**: All endpoints require `Authorization: Bearer <JWT_TOKEN>` header (except login)

## 🧪 Development Guidelines

### Code Style
- ESLint enforced formatting (frontend configured, backend pending)
- React Hooks best practices for functional components
- Mongoose for all database operations
- Consistent error handling and response formats

### Response Format
All APIs follow this standard format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": { "page": 1, "limit": 10, "total": 50 }
}
```

### Error Handling
```json
{
  "success": false,
  "message": "Descriptive error message",
  "error": "error-code"
}
```

### Adding New Features
1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Add routes in `src/routes/routes.js`
4. Create UI components in frontend
5. Connect frontend to API endpoints
6. Test with Postman/Thunder Client
7. Document in API endpoints section above

---

## 🚀 Deployment

### Frontend Deployment (Recommended: Vercel)
See [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md#frontend-deployment) for detailed steps.

**Quick Start:**
1. Connect GitHub repo to [vercel.com](https://vercel.com)
2. Select `inventory_frontend/Inventory_Frontend` as root
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy (automatic on each push)

**Cost**: FREE ✅

### Backend Deployment (Recommended: Render.com)
See [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md#backend-deployment) for detailed steps.

**Quick Start:**
1. Connect GitHub repo to [render.com](https://render.com)
2. Select `inventory_backend/Inventory_Backend` as root
3. Set environment variables (MONGO_URI, JWT_SECRET, etc.)
4. Deploy

**Cost**: FREE tier (shared resources), $7/month for dedicated

### Database Deployment (Recommended: MongoDB Atlas)
See [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md#database-setup) for detailed steps.

**Quick Start:**
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create M0 free cluster (512MB storage)
3. Create database user and get connection string
4. Add connection string to backend environment

**Cost**: FREE tier (512MB), $57+/month for larger storage

### Complete Deployment Checklist
See [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md) for:
- ✅ Step-by-step deployment instructions
- ✅ CI/CD GitHub Actions pipeline
- ✅ Custom domain setup
- ✅ SSL/TLS certificates (free)
- ✅ Monitoring and logging
- ✅ Backup and recovery
- ✅ Troubleshooting guide

**Total Deployment Cost: $0 (free tier) to $25-100/month (production scaling)**

---

## 📊 Database Models

### Core Models (15 total)
| Model | Purpose |
|-------|---------|
| Admin | System administrators |
| Staff | Employee records |
| Customer | Customer information |
| Supplier | Supplier details |
| Item | Product catalog |
| Category | Item categorization |
| Warehouse | Storage locations |
| Stock | Real-time inventory |
| SalesOrder | Sales transactions |
| PurchaseOrder | Purchase transactions |
| Invoice | Billing records |
| Finance | Income/expense tracking |
| Damage | Damage records |
| Role | User roles & permissions |
| Valuation | Inventory valuation records |

---

## 🔍 Monitoring & Maintenance

### Monitoring (Free Options)
- **UptimeRobot**: Free uptime monitoring (50 monitors)
- **Sentry**: Error tracking and reporting
- **Vercel Analytics**: Built-in frontend monitoring
- **Render Logs**: Backend logs and debugging

### Regular Maintenance
**Weekly:**
- Check uptime monitor alerts
- Review error logs (Sentry)
- Verify database backups

**Monthly:**
- Update dependencies: `npm update`
- Security audit: `npm audit`
- Review logs for suspicious activity

**Quarterly:**
- Rotate secrets/API keys
- Performance optimization review
- Update security patches

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and commit: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request with description

### Pre-commit Checklist
- [ ] Code follows ESLint guidelines
- [ ] No console.log() statements (except errors)
- [ ] No hardcoded credentials
- [ ] Tests passing (if added)
- [ ] API documentation updated
- [ ] No sensitive data in comments

---

## 📚 Documentation

- **[PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)** - Security fixes & enhancements (MUST READ)
- **[FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md)** - Complete deployment for $0
- **[SECURITY.md](SECURITY.md)** - Security guidelines and best practices
- **[audit_report.md](audit_report.md)** - Detailed system audit and status

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check if port 8000 is available
lsof -i :8000

# Ensure .env file exists and has valid credentials
# Verify MongoDB connection string is correct
```

**Frontend can't reach backend:**
```bash
# Verify NEXT_PUBLIC_API_URL is set correctly
# Ensure backend server is running
# Check CORS settings in backend index.js
```

**Database connection fails:**
```bash
# Test connection locally: mongosh "your-connection-string"
# Verify username and password
# Check IP whitelist in MongoDB Atlas
```

**npm install errors:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

See [FREE_DEPLOYMENT_GUIDE.md#troubleshooting](FREE_DEPLOYMENT_GUIDE.md#troubleshooting) for more detailed troubleshooting.

---

## 📞 Support & Resources

### Documentation
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

### Deployment Help
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/manual/)

### Security Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## 📝 License

This project is licensed under the ISC License.

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Backend Controllers** | 18 modules |
| **Database Models** | 15 schemas |
| **API Endpoints** | 100+ routes |
| **Frontend Components** | 40+ components |
| **Production Readiness** | 85% |
| **Security Issues** | 4 critical (see PRODUCTION_READINESS.md) |
| **Test Coverage** | 0% (needs implementation) |
| **Documentation** | 95% complete |

---

**Last Updated**: April 16, 2026  
**Current Version**: 1.0.0  
**Maintainer**: Development Team

**⚠️ IMPORTANT**: Before deploying to production, read [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) and fix all critical security issues.
